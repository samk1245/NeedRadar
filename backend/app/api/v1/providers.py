from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.organisation import (
    Organisation, OrgType, VerificationStatus, OrganisationMember, ServiceOffering
)
from app.models.need import Need, NeedStatus, NeedCategory, NeedStatusHistory
from app.models.response import ProviderResponse, ResponseStatus, ResolutionProposal, ResolutionStatus
from app.schemas.provider import (
    OrganisationCreate, OrganisationUpdate, OrganisationRead,
    ResolutionProposalReview, ResolutionProposalRead
)
from app.schemas.need import NeedRead
from app.api.deps import get_current_user
from app.api.v1.needs import format_need_read
from app.services.state_machine import can_transition_resolution
from app.services.audit_logger import log_audit_event
from app.models.notification import Notification, NotificationType

router = APIRouter()

@router.post("/organisations", response_model=OrganisationRead, status_code=status.HTTP_201_CREATED)
def register_organisation(
    org_in: OrganisationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user already owns an org
    existing_membership = db.query(OrganisationMember).filter(OrganisationMember.user_id == current_user.id).first()
    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already associated with an existing organisation"
        )

    org = Organisation(
        name=org_in.name,
        description=org_in.description,
        org_type=org_in.org_type,
        registration_number=org_in.registration_number,
        website_url=org_in.website_url,
        contact_email=org_in.contact_email,
        contact_phone=org_in.contact_phone,
        city=org_in.city,
        service_area=org_in.service_area,
        operating_hours=org_in.operating_hours,
        capacity_description=org_in.capacity_description,
        eligibility_criteria=org_in.eligibility_criteria,
        verification_status=VerificationStatus.PENDING
    )
    db.add(org)
    db.flush()

    # Link user as admin of the org
    member = OrganisationMember(
        organisation_id=org.id,
        user_id=current_user.id,
        role="admin"
    )
    db.add(member)

    # Attach service offerings
    for cat in org_in.categories:
        offering = ServiceOffering(
            organisation_id=org.id,
            category=cat
        )
        db.add(offering)

    # Update user role to PROVIDER or NGO if not admin/moderator
    if current_user.role not in {UserRole.MODERATOR, UserRole.ADMIN}:
        current_user.role = UserRole.NGO if org_in.org_type == OrgType.NGO else UserRole.PROVIDER

    log_audit_event(
        db=db,
        action="ORGANISATION_REGISTERED",
        resource_type="organisation",
        resource_id=org.id,
        user_id=current_user.id,
        user_email=current_user.email,
        user_role=current_user.role.value
    )

    db.commit()
    db.refresh(org)
    return org

@router.get("/organisations/me", response_model=Optional[OrganisationRead])
def get_my_organisation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = db.query(OrganisationMember).filter(OrganisationMember.user_id == current_user.id).first()
    if not membership:
        return None
    return membership.organisation

@router.patch("/organisations/me", response_model=OrganisationRead)
def update_my_organisation(
    org_in: OrganisationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    membership = db.query(OrganisationMember).filter(OrganisationMember.user_id == current_user.id).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No organisation profile found")
        
    org = membership.organisation
    for field, val in org_in.model_dump(exclude_unset=True).items():
        setattr(org, field, val)

    db.commit()
    db.refresh(org)
    return org

@router.get("/opportunities", response_model=List[NeedRead])
def get_matching_opportunities(
    category: Optional[NeedCategory] = None,
    locality: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns open, actionable community requests in the provider's active domain.
    """
    membership = db.query(OrganisationMember).filter(OrganisationMember.user_id == current_user.id).first()
    
    query = db.query(Need).filter(
        Need.status.in_([NeedStatus.PUBLISHED, NeedStatus.MATCHED, NeedStatus.ASSISTANCE_IN_PROGRESS])
    )

    if category:
        query = query.filter(Need.category == category)
    elif membership:
        # Match offerings
        org = membership.organisation
        categories = [s.category for s in org.services]
        if categories:
            query = query.filter(Need.category.in_(categories))

    if locality:
        query = query.filter(Need.locality.ilike(f"%{locality}%"))

    needs = query.order_by(desc(Need.unmet_demand_score)).limit(limit).all()
    return [format_need_read(n, current_user.id, db) for n in needs]

@router.post("/proposals/{proposal_id}/review", response_model=ResolutionProposalRead)
def review_resolution_proposal(
    proposal_id: str,
    review_in: ResolutionProposalReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = db.query(ResolutionProposal).filter(ResolutionProposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found")

    need = proposal.need
    is_resident = need.creator_id == current_user.id
    is_mod = current_user.role in {UserRole.MODERATOR, UserRole.ADMIN}

    if not is_resident and not is_mod:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the reporting resident or a moderator can review this resolution"
        )

    valid, msg = can_transition_resolution(proposal.status, review_in.status, current_user.role, is_resident)
    if not valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    proposal.status = review_in.status
    proposal.resident_feedback = review_in.feedback

    if review_in.status == ResolutionStatus.CONFIRMED:
        proposal.verified_at = datetime.now(timezone.utc)
        if is_mod:
            proposal.verified_by_moderator_id = current_user.id
            
        # Update Need state to RESOLVED
        old_status = need.status.value
        need.status = NeedStatus.RESOLVED
        
        history = NeedStatusHistory(
            need_id=need.id,
            old_status=old_status,
            new_status=NeedStatus.RESOLVED.value,
            actor_id=current_user.id,
            note=f"Resolution confirmed. Resident feedback: {review_in.feedback or 'Completed'}"
        )
        db.add(history)

        # Notify provider
        if proposal.proposer_id:
            notif = Notification(
                user_id=proposal.proposer_id,
                title="Resolution Confirmed!",
                message=f"The resident confirmed resolution for: {need.title[:40]}...",
                notification_type=NotificationType.RESOLUTION_CONFIRMED,
                link_url=f"/needs/{need.id}"
            )
            db.add(notif)
            
    elif review_in.status == ResolutionStatus.REJECTED:
        need.status = NeedStatus.ASSISTANCE_IN_PROGRESS
        history = NeedStatusHistory(
            need_id=need.id,
            old_status=NeedStatus.RESOLUTION_PROPOSED.value,
            new_status=NeedStatus.ASSISTANCE_IN_PROGRESS.value,
            actor_id=current_user.id,
            note=f"Resolution rejected by resident: {review_in.feedback or 'Unresolved'}"
        )
        db.add(history)

    db.commit()
    db.refresh(proposal)
    
    out = ResolutionProposalRead.model_validate(proposal)
    org = db.query(Organisation).filter(Organisation.id == proposal.organisation_id).first()
    if org:
        out.organisation_name = org.name
    return out
