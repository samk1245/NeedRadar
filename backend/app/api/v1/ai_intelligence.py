from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.need import Need, NeedStatus
from app.services.ai_concurrent_engine import ai_concurrent_engine

router = APIRouter()

class TriageRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Unstructured description of community need")
    city: Optional[str] = "Bengaluru"

class MatchRequest(BaseModel):
    skills: List[str] = Field(default_factory=list, description="Volunteer skills or resources offered")
    city: str = Field(default="Bengaluru", description="User's city")
    limit: Optional[int] = 6

@router.get("/telemetry")
def get_ai_concurrency_telemetry():
    """
    Returns live performance telemetry of the 50-100 concurrent user AI dispatcher engine.
    """
    return ai_concurrent_engine.get_telemetry()

@router.post("/triage")
def triage_civic_need(payload: TriageRequest):
    """
    Analyzes unstructured text and returns AI-categorized need parameters,
    urgency scores, and auto-generated requirement breakdown.
    Designed for fast non-blocking parallel execution (50-100 simultaneous users).
    """
    if not payload.text or len(payload.text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Input text must be at least 5 characters.")
    
    return ai_concurrent_engine.triage_need(payload.text, payload.city)

@router.post("/match")
def match_volunteer_needs(payload: MatchRequest, db: Session = Depends(get_db)):
    """
    Matches volunteer skills and location against active community needs in the radar.
    """
    open_needs = db.query(Need).filter(
        Need.status.notin_([NeedStatus.REJECTED, NeedStatus.CLOSED, NeedStatus.RESOLVED])
    ).all()

    # Filter by city candidates first if plentiful, else all
    city_needs = [n for n in open_needs if n.city.lower() == payload.city.lower()]
    pool = city_needs if len(city_needs) >= 3 else open_needs

    matched = ai_concurrent_engine.match_volunteer_skills(
        skills=payload.skills,
        city=payload.city,
        open_needs=pool,
        limit=payload.limit or 6
    )
    return {
        "user_city": payload.city,
        "active_matching_nodes": ai_concurrent_engine.get_telemetry()["active_concurrent_nodes"],
        "matches": matched
    }

@router.get("/stream")
def get_live_concurrency_stream(limit: int = Query(50, ge=10, le=100)):
    """
    Returns live feed simulating 50-100 active community members pledging,
    verifying, and resolving needs across India in real-time.
    """
    stream = ai_concurrent_engine.generate_live_concurrency_stream(total_nodes=limit)
    return {
        "active_nodes_count": len(stream),
        "concurrency_state": "Synchronized (50-100 Nodes)",
        "feed": stream
    }
