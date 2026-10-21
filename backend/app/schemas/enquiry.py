from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.models.enquiry import EnquiryCategory, EnquiryStatus

class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: str = Field(..., min_length=5, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    city: str = Field(default="Bengaluru", max_length=100)
    locality: Optional[str] = Field(None, max_length=100)
    category: EnquiryCategory = EnquiryCategory.GENERAL
    urgency: str = Field(default="medium", max_length=20)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=15, max_length=5000)
    reference_need_id: Optional[str] = None

class EnquiryRead(BaseModel):
    id: str
    ticket_id: str
    name: str
    email: str
    phone: Optional[str] = None
    city: str
    locality: Optional[str] = None
    category: EnquiryCategory
    urgency: str
    subject: str
    message: str
    reference_need_id: Optional[str] = None
    status: EnquiryStatus
    assigned_desk: str
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class EnquiryConfirmation(BaseModel):
    ticket_id: str
    status: EnquiryStatus
    assigned_desk: str
    message: str
    emergency_contact: str
    created_at: datetime
