from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.volunteer import PledgeType, PledgeStatus

class VolunteerPledgeCreate(BaseModel):
    need_id: Optional[str] = None
    volunteer_name: str = Field(..., min_length=2, max_length=100)
    volunteer_email: EmailStr
    volunteer_phone: str = Field(..., min_length=7, max_length=25)
    city: str = Field(..., min_length=2, max_length=60)
    pledge_type: PledgeType = PledgeType.TIME_HOURS
    hours_committed: int = Field(default=2, ge=1, le=100)
    pledge_description: str = Field(..., min_length=5, max_length=1000)
    availability: str = Field(default="Flexible", max_length=100)

class VolunteerPledgeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    need_id: Optional[str] = None
    need_title: Optional[str] = None
    volunteer_name: str
    volunteer_email: str
    volunteer_phone: str
    city: str
    pledge_type: PledgeType
    hours_committed: int
    pledge_description: str
    availability: str
    status: PledgeStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

class VolunteerPledgeStatusUpdate(BaseModel):
    status: PledgeStatus

class VolunteerRecentActivity(BaseModel):
    id: int
    volunteer_name: str
    city: str
    pledge_type: str
    hours_committed: int
    pledge_description: str
    created_at: datetime
    need_title: Optional[str] = None

class CityPledgeSummary(BaseModel):
    city: str
    count: int

class VolunteerImpactStats(BaseModel):
    total_pledges: int
    total_volunteer_hours: int
    city_filter: Optional[str] = None
    pledges_by_type: Dict[str, int]
    top_cities: List[CityPledgeSummary]
    recent_pledges: List[VolunteerRecentActivity]
