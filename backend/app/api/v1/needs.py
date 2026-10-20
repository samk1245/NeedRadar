import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.need import (
    Need, NeedCategory, NeedStatus, NeedSupporter, NeedFollow,
    NeedStatusHistory, DuplicateCandidate
)
from app.models.response import ProviderResponse, ResponseType, ResponseStatus, ResolutionProposal, ResolutionStatus
from app.models.organisation import Organisation, VerificationStatus
from app.schemas.need import (
    NeedCreate, NeedUpdate, NeedRead, NeedStatusUpdate,
    NeedStatusHistoryRead, DuplicateSuggestion
)
from app.schemas.provider import (
    ProviderResponseCreate, ProviderResponseRead,
    ResolutionProposalCreate, ResolutionProposalRead
)
from app.api.deps import get_current_user, get_optional_current_user
from app.services.duplicate_detector import detect_duplicate_candidates
from app.services.demand_intelligence import calculate_need_unmet_score
from app.services.state_machine import can_transition_need, can_transition_resolution
from app.services.audit_logger import log_audit_event
from app.models.notification import Notification, NotificationType

router = APIRouter()

@router.post("/check-duplicates", response_model=List[DuplicateSuggestion])
def check_duplicates_preview(
    req: NeedCreate,
    db: Session = Depends(get_db)
):
    duplicates = detect_duplicate_candidates(
        db=db,
        title=req.title,
        description=req.description,
        category=req.category.value,
        latitude=req.latitude,
        longitude=req.longitude,
        locality=req.locality
    )
    return duplicates

@router.post("", response_model=NeedRead, status_code=status.HTTP_201_CREATED)
def create_need(
    need_in: NeedCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Calculate obfuscated coordinates if marked sensitive or approximate
    approx_lat = need_in.latitude
    approx_lon = need_in.longitude
    if need_in.is_sensitive or need_in.is_location_approximate:
        # Add a gentle deterministic/controlled jitter (~300m)
        approx_lat = round(need_in.latitude + 0.003, 4)
        approx_lon = round(need_in.longitude - 0.003, 4)

    initial_score = calculate_need_unmet_score(
        supporters_count=0,
        affected_count=need_in.affected_count,
        created_at=datetime_now_utc(),
        has_provider_response=False
    )

    need = Need(
        title=need_in.title,
        description=need_in.description,
        category=need_in.category,
        subcategory=need_in.subcategory,
        urgency=need_in.urgency,
        scope=need_in.scope,
        affected_count=need_in.affected_count,
        desired_timeframe=need_in.desired_timeframe,
        image_url=need_in.image_url,
        city=need_in.city,
        locality=need_in.locality,
        latitude=need_in.latitude,
        longitude=need_in.longitude,
        is_location_approximate=need_in.is_location_approximate or need_in.is_sensitive,
        approx_latitude=approx_lat,
        approx_longitude=approx_lon,
        is_sensitive=need_in.is_sensitive,
        public_contact_preference=need_in.public_contact_preference,
        status=NeedStatus.PUBLISHED, # Immediately published in community radar
        unmet_demand_score=initial_score,
        creator_id=current_user.id
    )
    db.add(need)
    db.flush()

    # Log initial status history
    history = NeedStatusHistory(
        need_id=need.id,
        old_status=None,
        new_status=NeedStatus.PUBLISHED.value,
        actor_id=current_user.id,
        note="Need reported and published to community radar"
    )
    db.add(history)
    db.commit()
    db.refresh(need)

    return format_need_read(need, current_user.id, db)

@router.get("", response_model=List[NeedRead])
def list_needs(
    city: Optional[str] = "Bengaluru",
    locality: Optional[str] = None,
    category: Optional[NeedCategory] = None,
    status: Optional[NeedStatus] = None,
    search: Optional[str] = None,
    my_needs: bool = False,
    sort_by: str = Query("score", enum=["score", "recent", "urgency", "supporters"]),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(Need)
    
    if city:
        query = query.filter(Need.city == city)
    if locality:
        query = query.filter(Need.locality.ilike(f"%{locality}%"))
    if category:
        query = query.filter(Need.category == category)
    if status:
        query = query.filter(Need.status == status)
    else:
        # Default excludes rejected/closed unless requested
        query = query.filter(Need.status.notin_([NeedStatus.REJECTED]))

    if my_needs:
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        query = query.filter(Need.creator_id == current_user.id)

    if search:
        search_filter = or_(
            Need.title.ilike(f"%{search}%"),
            Need.description.ilike(f"%{search}%"),
            Need.locality.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

    # Sort
    if sort_by == "score":
        query = query.order_by(desc(Need.unmet_demand_score))
    elif sort_by == "recent":
        query = query.order_by(desc(Need.created_at))
    elif sort_by == "supporters":
        query = query.order_by(desc(Need.supporters_count))

    needs = query.offset(offset).limit(limit).all()
    user_id = current_user.id if current_user else None
    return [format_need_read(n, user_id, db) for n in needs]

@router.get("/{id}", response_model=NeedRead)
def get_need_detail(
    id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    need = db.query(Need).filter(Need.id == id).first()
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")
        
    user_id = current_user.id if current_user else None
    return format_need_read(need, user_id, db)

@router.patch("/{id}", response_model=NeedRead)
def update_need(
    id: str,
    need_in: NeedUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    need = db.query(Need).filter(Need.id == id).first()
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")
        
    # Permission check: creator or moderator/admin
    is_admin_or_mod = current_user.role in {UserRole.MODERATOR, UserRole.ADMIN}
    if need.creator_id != current_user.id and not is_admin_or_mod:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to edit this need")

    update_data = need_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(need, field, val)
        
    db.commit()
    db.refresh(need)
    return format_need_read(need, current_user.id, db)

@router.post("/{id}/status", response_model=NeedRead)
def update_need_status(
    id: str,
    status_in: NeedStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    need = db.query(Need).filter(Need.id == id).first()
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    is_creator = need.creator_id == current_user.id
    valid, msg = can_transition_need(need.status, status_in.status, current_user.role, is_creator)
    if not valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    old_status = need.status.value
    need.status = status_in.status
    if status_in.rejection_reason:
        need.rejection_reason = status_in.rejection_reason

    history = NeedStatusHistory(
        need_id=need.id,
        old_status=old_status,
        new_status=status_in.status.value,
        actor_id=current_user.id,
        note=status_in.note or f"Status changed to {status_in.status.value}"
    )
    db.add(history)
    db.commit()
    db.refresh(need)

    return format_need_read(need, current_user.id, db)

@router.post("/{id}/support")
def support_need(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    need = db.query(Need).filter(Need.id == id).first()
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    existing = db.query(NeedSupporter).filter(
        NeedSupporter.need_id == id,
        NeedSupporter.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already supported this need")

    support = NeedSupporter(need_id=id, user_id=current_user.id)
    db.add(support)
    
    # Recalculate supporters count and score
    need.supporters_count += 1
    has_resp = db.query(ProviderResponse).filter(ProviderResponse.need_id == id).count() > 0
    need.unmet_demand_score = calculate_need_unmet_score(
        supporters_count=need.supporters_count,
        affected_count=need.affected_count,
        created_at=need.created_at,
        has_provider_response=has_resp
    )
    db.commit()

    return {"message": "You have supported this community need", "supporters_count": need.supporters_count}

@router.delete("/{id}/support")
def remove_support(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    support = db.query(NeedSupporter).filter(
        NeedSupporter.need_id == id,
        NeedSupporter.user_id == current_user.id
    ).first()
    if not support:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="You have not supported this need")

    need = db.query(Need).filter(Need.id == id).first()
    db.delete(support)
    if need and need.supporters_count > 0:
        need.supporters_count -= 1
        has_resp = db.query(ProviderResponse).filter(ProviderResponse.need_id == id).count() > 0
        need.unmet_demand_score = calculate_need_unmet_score(
            supporters_count=need.supporters_count,
            affected_count=need.affected_count,
            created_at=need.created_at,
            has_provider_response=has_resp
        )
    db.commit()

    return {"message": "Support removed", "supporters_count": need.supporters_count if need else 0}

@router.post("/{id}/follow")
def follow_need(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(NeedFollow).filter(
        NeedFollow.need_id == id,
        NeedFollow.user_id == current_user.id
    ).first()
    if not existing:
        follow = NeedFollow(need_id=id, user_id=current_user.id)
        db.add(follow)
        db.commit()
    return {"message": "Following need updates"}

@router.delete("/{id}/follow")
def unfollow_need(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    follow = db.query(NeedFollow).filter(
        NeedFollow.need_id == id,
        NeedFollow.user_id == current_user.id
    ).first()
    if follow:
        db.delete(follow)
        db.commit()
    return {"message": "Unfollowed need"}

@router.get("/{id}/responses", response_model=List[ProviderResponseRead])
def get_need_responses(
    id: str,
    db: Session = Depends(get_db)
):
    responses = db.query(ProviderResponse).filter(ProviderResponse.need_id == id).order_by(desc(ProviderResponse.created_at)).all()
    results = []
    for r in responses:
        item = ProviderResponseRead.model_validate(r)
        if r.organisation:
            item.organisation_name = r.organisation.name
        results.append(item)
    return results

@router.post("/{id}/responses", response_model=ProviderResponseRead, status_code=status.HTTP_201_CREATED)
def create_need_response(
    id: str,
    res_in: ProviderResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify user belongs to a verified organisation
    from app.models.organisation import OrganisationMember
    membership = db.query(OrganisationMember).filter(OrganisationMember.user_id == current_user.id).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be an onboarded provider or NGO representative to respond"
        )
    org = membership.organisation
    if org.verification_status != VerificationStatus.VERIFIED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Your organisation verification status is '{org.verification_status.value}'. Only verified providers can respond."
        )

    need = db.query(Need).filter(Need.id == id).first()
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    response = ProviderResponse(
        need_id=id,
        organisation_id=org.id,
        responder_id=current_user.id,
        response_type=res_in.response_type,
        message=res_in.message,
        proposed_assistance=res_in.proposed_assistance,
        eligibility_requirements=res_in.eligibility_requirements,
        estimated_timeline=res_in.estimated_timeline,
        contact_instructions=res_in.contact_instructions
    )
    db.add(response)
    
    # Update need status to MATCHED or ASSISTANCE_IN_PROGRESS if published
    if need.status == NeedStatus.PUBLISHED:
        need.status = NeedStatus.MATCHED
        history = NeedStatusHistory(
            need_id=need.id,
            old_status=NeedStatus.PUBLISHED.value,
            new_status=NeedStatus.MATCHED.value,
            actor_id=current_user.id,
            note=f"Verified provider {org.name} responded"
        )
        db.add(history)

    # Recalculate score
    need.unmet_demand_score = calculate_need_unmet_score(
        supporters_count=need.supporters_count,
        affected_count=need.affected_count,
        created_at=need.created_at,
        has_provider_response=True
    )

    # Notify need creator
    notification = Notification(
        user_id=need.creator_id,
        title=f"New response for: {need.title[:40]}...",
        message=f"{org.name} has submitted proposed assistance.",
        notification_type=NotificationType.NEW_RESPONSE,
        link_url=f"/needs/{need.id}"
    )
    db.add(notification)

    db.commit()
    db.refresh(response)

    res_read = ProviderResponseRead.model_validate(response)
    res_read.organisation_name = org.name
    return res_read

@router.get("/{id}/resolution-proposals", response_model=List[ResolutionProposalRead])
def get_resolution_proposals(
    id: str,
    db: Session = Depends(get_db)
):
    proposals = db.query(ResolutionProposal).filter(ResolutionProposal.need_id == id).order_by(desc(ResolutionProposal.created_at)).all()
    results = []
    for p in proposals:
        item = ResolutionProposalRead.model_validate(p)
        org = db.query(Organisation).filter(Organisation.id == p.organisation_id).first()
        if org:
            item.organisation_name = org.name
        results.append(item)
    return results

@router.post("/{id}/resolution-proposals", response_model=ResolutionProposalRead, status_code=status.HTTP_201_CREATED)
def propose_need_resolution(
    id: str,
    prop_in: ResolutionProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.organisation import OrganisationMember
    membership = db.query(OrganisationMember).filter(OrganisationMember.user_id == current_user.id).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only providers can propose resolution")
        
    org = membership.organisation
    need = db.query(Need).filter(Need.id == id).first()
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    proposal = ResolutionProposal(
        need_id=id,
        organisation_id=org.id,
        proposer_id=current_user.id,
        summary=prop_in.summary,
        evidence_notes=prop_in.evidence_notes,
        status=ResolutionStatus.PROPOSED
    )
    db.add(proposal)
    
    # Update need state to RESOLUTION_PROPOSED
    need.status = NeedStatus.RESOLUTION_PROPOSED
    history = NeedStatusHistory(
        need_id=need.id,
        old_status=need.status.value,
        new_status=NeedStatus.RESOLUTION_PROPOSED.value,
        actor_id=current_user.id,
        note=f"Resolution proposed by {org.name}"
    )
    db.add(history)

    # Notify resident
    notif = Notification(
        user_id=need.creator_id,
        title="Resolution Proposed for Your Request",
        message=f"{org.name} has submitted a resolution proposal. Please review and confirm outcome.",
        notification_type=NotificationType.RESOLUTION_PROPOSED,
        link_url=f"/needs/{need.id}"
    )
    db.add(notif)

    db.commit()
    db.refresh(proposal)

    out = ResolutionProposalRead.model_validate(proposal)
    out.organisation_name = org.name
    return out

def format_need_read(need: Need, user_id: Optional[str], db: Session) -> NeedRead:
    has_supp = False
    has_foll = False
    if user_id:
        has_supp = db.query(NeedSupporter).filter(
            NeedSupporter.need_id == need.id,
            NeedSupporter.user_id == user_id
        ).first() is not None
        has_foll = db.query(NeedFollow).filter(
            NeedFollow.need_id == need.id,
            NeedFollow.user_id == user_id
        ).first() is not None

    resp_count = db.query(ProviderResponse).filter(ProviderResponse.need_id == need.id).count()
    
    # Mask coordinates if approximate or sensitive
    lat = need.approx_latitude if (need.is_location_approximate and need.approx_latitude) else need.latitude
    lon = need.approx_longitude if (need.is_location_approximate and need.approx_longitude) else need.longitude

    creator_name = need.creator.full_name if need.creator else "Community Member"

    return NeedRead(
        id=need.id,
        title=need.title,
        description=need.description,
        category=need.category,
        subcategory=need.subcategory,
        urgency=need.urgency,
        scope=need.scope,
        affected_count=need.affected_count,
        desired_timeframe=need.desired_timeframe,
        image_url=need.image_url,
        city=need.city,
        locality=need.locality,
        latitude=lat,
        longitude=lon,
        is_location_approximate=need.is_location_approximate,
        is_sensitive=need.is_sensitive,
        public_contact_preference=need.public_contact_preference,
        status=need.status,
        supporters_count=need.supporters_count,
        unmet_demand_score=need.unmet_demand_score,
        is_demo=need.is_demo,
        creator_id=need.creator_id,
        creator_name=creator_name,
        created_at=need.created_at,
        updated_at=need.updated_at,
        has_supported=has_supp,
        has_followed=has_foll,
        responses_count=resp_count
    )

def datetime_now_utc():
    from datetime import datetime, timezone
    return datetime.now(timezone.utc)
