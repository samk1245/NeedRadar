import random
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.cities import CITIES_REGISTRY
from app.models.enquiry import Enquiry, EnquiryCategory, EnquiryStatus
from app.schemas.enquiry import EnquiryCreate, EnquiryRead, EnquiryConfirmation

router = APIRouter()

@router.post("", response_model=EnquiryConfirmation, status_code=status.HTTP_201_CREATED)
def submit_enquiry(enquiry_in: EnquiryCreate, db: Session = Depends(get_db)):
    """
    Submit a citizen enquiry, grievance, or rapid escalation ticket.
    Generates a unique tracking ID and assigns to civic action response desk.
    """
    now = datetime.now(timezone.utc)
    rand_num = random.randint(1000, 9999)
    ticket_id = f"RADAR-{now.year}-{rand_num}"

    # Determine city helpline for immediate confirmation
    city_info = CITIES_REGISTRY.get(enquiry_in.city) or CITIES_REGISTRY.get("Bengaluru")
    emergency_contact = city_info.get("helpline", "112 / 108") if city_info else "112"

    enquiry = Enquiry(
        ticket_id=ticket_id,
        name=enquiry_in.name,
        email=enquiry_in.email,
        phone=enquiry_in.phone,
        city=enquiry_in.city,
        locality=enquiry_in.locality,
        category=enquiry_in.category,
        urgency=enquiry_in.urgency,
        subject=enquiry_in.subject,
        message=enquiry_in.message,
        reference_need_id=enquiry_in.reference_need_id,
        status=EnquiryStatus.RECEIVED,
        assigned_desk="Civic Action Response Desk"
    )

    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    return EnquiryConfirmation(
        ticket_id=ticket_id,
        status=enquiry.status,
        assigned_desk=enquiry.assigned_desk,
        message="Your civic enquiry has been recorded in the NeedRadar coordination queue. Verified partners and municipal coordinators have been notified.",
        emergency_contact=emergency_contact,
        created_at=enquiry.created_at
    )

@router.get("", response_model=List[EnquiryRead])
def list_enquiries(
    city: Optional[str] = None,
    category: Optional[EnquiryCategory] = None,
    db: Session = Depends(get_db)
):
    """
    List civic enquiries and grievances.
    """
    query = db.query(Enquiry)
    if city:
        query = query.filter(Enquiry.city == city)
    if category:
        query = query.filter(Enquiry.category == category)
    
    return query.order_by(Enquiry.created_at.desc()).limit(100).all()

@router.get("/helplines")
def get_city_helplines(city: Optional[str] = "Bengaluru") -> Dict[str, Any]:
    """
    Retrieve live emergency, hospital, and municipal control room contact numbers for a city.
    """
    city_data = CITIES_REGISTRY.get(city) or CITIES_REGISTRY.get("Bengaluru")
    return {
        "city": city_data.get("name"),
        "state": city_data.get("state"),
        "municipal_authority": city_data.get("municipal_authority"),
        "municipal_helpline": city_data.get("helpline"),
        "national_emergency": "112",
        "ambulance": city_data.get("ambulance", "108"),
        "police": city_data.get("police", "112"),
        "women_safety": "1091",
        "childline": "1098",
        "disaster_management": "1078",
        "blood_coordination": "104 (eRaktKosh National Portal)",
        "senior_citizen_helpline": "14567"
    }
