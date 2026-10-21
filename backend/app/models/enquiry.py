import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, Enum
from app.core.database import Base

class EnquiryCategory(str, enum.Enum):
    NEED_RESOLUTION = "need_resolution"
    EMERGENCY_ESCALATION = "emergency_escalation"
    NGO_PARTNERSHIP = "ngo_partnership"
    GRIEVANCE = "grievance"
    FALSE_REPORT = "false_report"
    VOLUNTEER = "volunteer"
    GENERAL = "general"

class EnquiryStatus(str, enum.Enum):
    RECEIVED = "received"
    IN_REVIEW = "in_review"
    DISPATCHED = "dispatched"
    RESOLVED = "resolved"

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    city = Column(String(100), default="Bengaluru", nullable=False, index=True)
    locality = Column(String(100), nullable=True)
    category = Column(Enum(EnquiryCategory), default=EnquiryCategory.GENERAL, nullable=False)
    urgency = Column(String(20), default="medium", nullable=False)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    reference_need_id = Column(String(36), nullable=True)
    
    status = Column(Enum(EnquiryStatus), default=EnquiryStatus.RECEIVED, nullable=False)
    assigned_desk = Column(String(100), default="Civic Action Response Desk", nullable=False)
    resolution_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
