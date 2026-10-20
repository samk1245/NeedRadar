from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.models.need import NeedCategory, NeedUrgency, NeedScope, NeedStatus

class NeedCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20, max_length=4000)
    category: NeedCategory
    subcategory: Optional[str] = None
    urgency: NeedUrgency = NeedUrgency.MEDIUM
    scope: NeedScope = NeedScope.COMMUNITY
    affected_count: int = Field(default=1, ge=1, le=100000)
    desired_timeframe: str = "Within 2 weeks"
    image_url: Optional[str] = None
    
    city: str = "Bengaluru"
    locality: str = Field(..., min_length=2, max_length=100)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    is_location_approximate: bool = False
    is_sensitive: bool = False
    public_contact_preference: str = "in_app"

class NeedUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[NeedCategory] = None
    subcategory: Optional[str] = None
    urgency: Optional[NeedUrgency] = None
    desired_timeframe: Optional[str] = None
    affected_count: Optional[int] = None
    image_url: Optional[str] = None

class NeedStatusUpdate(BaseModel):
    status: NeedStatus
    note: Optional[str] = None
    rejection_reason: Optional[str] = None

class NeedStatusHistoryRead(BaseModel):
    id: str
    old_status: Optional[str] = None
    new_status: str
    actor_id: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class NeedRead(BaseModel):
    id: str
    title: str
    description: str
    category: NeedCategory
    subcategory: Optional[str] = None
    urgency: NeedUrgency
    scope: NeedScope
    affected_count: int
    desired_timeframe: str
    image_url: Optional[str] = None
    
    city: str
    locality: str
    latitude: float
    longitude: float
    is_location_approximate: bool
    is_sensitive: bool
    public_contact_preference: str
    
    status: NeedStatus
    supporters_count: int
    unmet_demand_score: float
    is_demo: bool
    
    creator_id: str
    creator_name: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # User interaction status for authenticated viewer
    has_supported: Optional[bool] = False
    has_followed: Optional[bool] = False
    responses_count: Optional[int] = 0
    model_config = ConfigDict(from_attributes=True)

class NeedMapItem(BaseModel):
    id: str
    title: str
    category: NeedCategory
    locality: str
    city: str
    latitude: float
    longitude: float
    is_location_approximate: bool
    urgency: NeedUrgency
    status: NeedStatus
    supporters_count: int
    unmet_demand_score: float
    created_at: datetime

class DuplicateSuggestion(BaseModel):
    id: str
    title: str
    category: NeedCategory
    locality: str
    similarity_score: float
    reason: str
    status: NeedStatus
