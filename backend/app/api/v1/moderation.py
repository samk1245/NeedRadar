from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.need import Need, NeedStatus, NeedSupporter, NeedStatusHistory
from app.models.organisation import Organisation, VerificationStatus
from app.models.moderation import ModerationReport, ModerationAction, AuditLog
from app.models.notification import Notification, NotificationType
from app.schemas.moderation import (
    ModerationReportCreate, ModerationReportRead,
    ModerationActionRead, DuplicateMergeRequest
)
from app.schemas.provider import OrganisationVerificationAction, OrganisationRead
from app.schemas.need import NeedRead
from app.api.deps import get_current_user, require_roles
from app.api.v1.needs import format_need_read
from app.services.audit_logger import log_audit_event

router = APIRouter()

@router.post("/reports", response_model=ModerationReportRead, status_code=status.HTTP_201_CREATED)
def submit_abuse_report(
    rep_in: ModerationReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    need = db.query(Need).filter(Need.id == rep_in.need_id).first()
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    report = ModerationReport(
        need_id=rep_in.need_id,
        reporter_id=current_user.id,
        reason=rep_in.reason,
        details=rep_in.details,
        status="pending"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/queue")
def get_moderation_queue(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.MODERATOR, UserRole.ADMIN]))
):
    pending_reports = db.query(ModerationReport).filter(ModerationReport.status == "pending").order_by(desc(ModerationReport.created_at)).all()
    pending_orgs = db.query(Organisation).filter(Organisation.verification_status == VerificationStatus.PENDING).all()
    flagged_needs = db.query(Need).filter(Need.status == NeedStatus.UNDER_REVIEW).all()

    return {
        "pending_abuse_reports_count": len(pending_reports),
        "pending_abuse_reports": [
            {
                "id": r.id,
                "need_id": r.need_id,
                "reason": r.reason,
                "details": r.details,
                "created_at": r.created_at
            }
            for r in pending_reports
        ],
        "pending_organisations_count": len(pending_orgs),
        "pending_organisations": [OrganisationRead.model_validate(o) for o in pending_orgs],
        "flagged_needs_count": len(flagged_needs),
        "flagged_needs": [format_need_read(n, current_user.id, db) for n in flagged_needs]
    }

@router.post("/needs/{id}/review")
def review_need(
    id: str,
    action: str = Query(..., enum=["approve", "reject", "hide", "request_clarification"]),
    reason: str = Query(..., min_length=5),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.MODERATOR, UserRole.ADMIN]))
):
    need = db.query(Need).filter(Need.id == id).first()
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    old_status = need.status.value
    if action == "approve":
        need.status = NeedStatus.PUBLISHED
    elif action == "reject":
        need.status = NeedStatus.REJECTED
        need.rejection_reason = reason
    elif action == "hide":
        need.status = NeedStatus.UNDER_REVIEW
    elif action == "request_clarification":
        need.status = NeedStatus.UNDER_REVIEW

    history = NeedStatusHistory(
        need_id=need.id,
        old_status=old_status,
        new_status=need.status.value,
        actor_id=current_user.id,
        note=f"Moderation action '{action}': {reason}"
    )
    db.add(history)

    # Record moderation action audit
    mod_action = ModerationAction(
        actor_id=current_user.id,
        target_type="need",
        target_id=need.id,
        action_type=action,
        reason=reason,
        state_before={"status": old_status},
        state_after={"status": need.status.value}
    )
    db.add(mod_action)

    log_audit_event(
        db=db,
        action=f"NEED_MODERATION_{action.upper()}",
        resource_type="need",
        resource_id=need.id,
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role.value,
        details={"reason": reason, "old_status": old_status, "new_status": need.status.value}
    )

    db.commit()
    return {"message": f"Need {action} completed successfully", "new_status": need.status.value}

@router.post("/organisations/{id}/verification", response_model=OrganisationRead)
def update_organisation_verification(
    id: str,
    action_in: OrganisationVerificationAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.MODERATOR, UserRole.ADMIN]))
):
    org = db.query(Organisation).filter(Organisation.id == id).first()
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organisation not found")

    old_status = org.verification_status.value
    org.verification_status = action_in.status
    org.verification_notes = action_in.notes
    if action_in.status == VerificationStatus.VERIFIED:
        org.verified_at = datetime.now(timezone.utc)

    mod_action = ModerationAction(
        actor_id=current_user.id,
        target_type="organisation",
        target_id=org.id,
        action_type=f"set_verification_{action_in.status.value}",
        reason=action_in.notes or "Moderator verification review",
        state_before={"verification_status": old_status},
        state_after={"verification_status": action_in.status.value}
    )
    db.add(mod_action)

    # Notify org admins
    for member in org.members:
        notif = Notification(
            user_id=member.user_id,
            title=f"Organisation Verification: {action_in.status.value.upper()}",
            message=f"Your organisation profile verification status is now {action_in.status.value}. Notes: {action_in.notes or 'None'}",
            notification_type=NotificationType.VERIFICATION_UPDATE,
            link_url="/provider"
        )
        db.add(notif)

    log_audit_event(
        db=db,
        action="ORGANISATION_VERIFICATION_UPDATE",
        resource_type="organisation",
        resource_id=org.id,
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role.value,
        details={"old_status": old_status, "new_status": action_in.status.value, "notes": action_in.notes}
    )

    db.commit()
    db.refresh(org)
    return org

@router.post("/merge-duplicates")
def merge_duplicates(
    req: DuplicateMergeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.MODERATOR, UserRole.ADMIN]))
):
    primary = db.query(Need).filter(Need.id == req.primary_need_id).first()
    duplicate = db.query(Need).filter(Need.id == req.duplicate_need_id).first()

    if not primary or not duplicate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Primary or duplicate need not found")

    # Transfer unique supporters from duplicate to primary
    dup_supporters = db.query(NeedSupporter).filter(NeedSupporter.need_id == duplicate.id).all()
    transferred = 0
    for s in dup_supporters:
        exists_on_primary = db.query(NeedSupporter).filter(
            NeedSupporter.need_id == primary.id,
            NeedSupporter.user_id == s.user_id
        ).first()
        if not exists_on_primary:
            s.need_id = primary.id
            transferred += 1
        else:
            db.delete(s)

    primary.supporters_count += transferred
    
    # Mark duplicate as closed
    duplicate.status = NeedStatus.CLOSED
    history = NeedStatusHistory(
        need_id=duplicate.id,
        old_status=duplicate.status.value,
        new_status=NeedStatus.CLOSED.value,
        actor_id=current_user.id,
        note=f"Merged into primary need '{primary.id}': {req.reason}"
    )
    db.add(history)

    log_audit_event(
        db=db,
        action="NEEDS_MERGED",
        resource_type="need",
        resource_id=primary.id,
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role.value,
        details={
            "duplicate_id": duplicate.id,
            "transferred_supporters": transferred,
            "reason": req.reason
        }
    )

    db.commit()
    return {
        "message": f"Successfully merged duplicate into primary need. {transferred} unique supporter(s) transferred.",
        "primary_id": primary.id,
        "primary_supporters_count": primary.supporters_count
    }

@router.get("/audit-logs", response_model=List[dict])
def get_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.MODERATOR, UserRole.ADMIN]))
):
    logs = db.query(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit).all()
    return [
        {
            "id": l.id,
            "user_email": l.user_email,
            "user_role": l.user_role,
            "action": l.action,
            "resource_type": l.resource_type,
            "resource_id": l.resource_id,
            "details": l.details,
            "created_at": l.created_at
        }
        for l in logs
    ]
