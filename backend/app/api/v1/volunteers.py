from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.core.database import get_db
from app.models.volunteer import VolunteerPledge, PledgeType, PledgeStatus
from app.models.need import Need
from app.models.notification import Notification, NotificationType
from app.schemas.volunteer import (
    VolunteerPledgeCreate,
    VolunteerPledgeResponse,
    VolunteerImpactStats,
    VolunteerRecentActivity,
    VolunteerPledgeStatusUpdate,
    CityPledgeSummary
)

router = APIRouter()

@router.post("/pledge", response_model=VolunteerPledgeResponse, status_code=status.HTTP_201_CREATED)
def submit_volunteer_pledge(
    payload: VolunteerPledgeCreate,
    db: Session = Depends(get_db)
):
    """
    Submit a citizen volunteer or resource pledge for a community need or city-wide civic action.
    """
    need_title = None
    if payload.need_id:
        need = db.query(Need).filter(Need.id == payload.need_id).first()
        if not need:
            raise HTTPException(status_code=404, detail="Referenced need does not exist")
        need_title = need.title
        
        # If the need has a creator user, send a notification
        if need.creator_id:
            notif = Notification(
                user_id=need.creator_id,
                notification_type=NotificationType.NEW_RESPONSE,
                title=f"New Volunteer Pledge: {payload.volunteer_name}",
                message=f"{payload.volunteer_name} pledged {payload.hours_committed} hrs / assistance ({payload.pledge_type}) for '{need.title}'.",
                link_url=f"/needs/{need.id}"
            )
            db.add(notif)

    pledge = VolunteerPledge(
        need_id=payload.need_id,
        volunteer_name=payload.volunteer_name.strip(),
        volunteer_email=payload.volunteer_email.strip().lower(),
        volunteer_phone=payload.volunteer_phone.strip(),
        city=payload.city.strip(),
        pledge_type=payload.pledge_type,
        hours_committed=payload.hours_committed,
        pledge_description=payload.pledge_description.strip(),
        availability=payload.availability.strip(),
        status=PledgeStatus.PENDING
    )
    db.add(pledge)
    db.commit()
    db.refresh(pledge)

    resp = VolunteerPledgeResponse.model_validate(pledge)
    resp.need_title = need_title
    return resp

@router.get("/pledges", response_model=List[VolunteerPledgeResponse])
def list_volunteer_pledges(
    city: Optional[str] = Query(None, description="Filter by city"),
    need_id: Optional[str] = Query(None, description="Filter by need ID"),
    pledge_type: Optional[PledgeType] = Query(None, description="Filter by pledge type"),
    status: Optional[PledgeStatus] = Query(None, description="Filter by status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    List civic volunteer pledges with optional filtering.
    """
    q = db.query(VolunteerPledge)
    if city:
        q = q.filter(VolunteerPledge.city.ilike(city))
    if need_id is not None:
        q = q.filter(VolunteerPledge.need_id == need_id)
    if pledge_type:
        q = q.filter(VolunteerPledge.pledge_type == pledge_type)
    if status:
        q = q.filter(VolunteerPledge.status == status)

    pledges = q.order_decay_or_created = q.order_by(desc(VolunteerPledge.created_at)).offset(offset).limit(limit).all()

    results = []
    for p in pledges:
        item = VolunteerPledgeResponse.model_validate(p)
        if p.need:
            item.need_title = p.need.title
        results.append(item)
    return results

@router.get("/impact-stats", response_model=VolunteerImpactStats)
def get_volunteer_impact_stats(
    city: Optional[str] = Query(None, description="Optional city filter"),
    db: Session = Depends(get_db)
):
    """
    Retrieve real-time civic volunteer mobilization statistics and recent activity stream.
    """
    base_q = db.query(VolunteerPledge)
    if city:
        base_q = base_q.filter(VolunteerPledge.city.ilike(city))

    total_pledges = base_q.count()
    total_hours = db.query(func.coalesce(func.sum(VolunteerPledge.hours_committed), 0))
    if city:
        total_hours = total_hours.filter(VolunteerPledge.city.ilike(city))
    total_hours_val = total_hours.scalar() or 0

    # Pledges by type
    type_counts = {}
    type_rows = db.query(
        VolunteerPledge.pledge_type,
        func.count(VolunteerPledge.id)
    )
    if city:
        type_rows = type_rows.filter(VolunteerPledge.city.ilike(city))
    type_rows = type_rows.group_by(VolunteerPledge.pledge_type).all()
    for pt, count in type_rows:
        type_counts[str(pt.value if hasattr(pt, "value") else pt)] = count

    # Top cities
    top_city_rows = db.query(
        VolunteerPledge.city,
        func.count(VolunteerPledge.id)
    ).group_by(VolunteerPledge.city).order_by(desc(func.count(VolunteerPledge.id))).limit(10).all()
    top_cities = [CityPledgeSummary(city=c, count=cnt) for c, cnt in top_city_rows]

    # Recent activity ticker items
    recent_q = db.query(VolunteerPledge).order_by(desc(VolunteerPledge.created_at)).limit(12).all()
    recent_activities = []
    for r in recent_q:
        recent_activities.append(
            VolunteerRecentActivity(
                id=r.id,
                volunteer_name=r.volunteer_name,
                city=r.city,
                pledge_type=str(r.pledge_type.value if hasattr(r.pledge_type, "value") else r.pledge_type),
                hours_committed=r.hours_committed,
                pledge_description=r.pledge_description,
                created_at=r.created_at,
                need_title=r.need.title if r.need else None
            )
        )

    return VolunteerImpactStats(
        total_pledges=total_pledges,
        total_volunteer_hours=int(total_hours_val),
        city_filter=city,
        pledges_by_type=type_counts,
        top_cities=top_cities,
        recent_pledges=recent_activities
    )

@router.patch("/pledges/{pledge_id}/status", response_model=VolunteerPledgeResponse)
def update_pledge_status(
    pledge_id: int,
    payload: VolunteerPledgeStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    Update status of a volunteer pledge (e.g. accepted, fulfilled).
    """
    pledge = db.query(VolunteerPledge).filter(VolunteerPledge.id == pledge_id).first()
    if not pledge:
        raise HTTPException(status_code=404, detail="Volunteer pledge not found")

    pledge.status = payload.status
    db.commit()
    db.refresh(pledge)

    resp = VolunteerPledgeResponse.model_validate(pledge)
    if pledge.need:
        resp.need_title = pledge.need.title
    return resp
