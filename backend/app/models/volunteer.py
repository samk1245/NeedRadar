from datetime import datetime, timezone
import enum
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class PledgeType(str, enum.Enum):
    TIME_HOURS = "time_hours"
    SUPPLIES_KIT = "supplies_kit"
    BLOOD_DONATION = "blood_donation"
    SKILLED_MENTORSHIP = "skilled_mentorship"
    EMERGENCY_TRANSPORT = "emergency_transport"

class PledgeStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    FULFILLED = "fulfilled"
    CANCELLED = "cancelled"

class VolunteerPledge(Base):
    __tablename__ = "volunteer_pledges"

    id = Column(Integer, primary_key=True, index=True)
    need_id = Column(String(36), ForeignKey("needs.id", ondelete="SET NULL"), nullable=True, index=True)
    volunteer_name = Column(String(100), nullable=False)
    volunteer_email = Column(String(255), nullable=False)
    volunteer_phone = Column(String(30), nullable=False)
    city = Column(String(60), nullable=False, index=True)
    pledge_type = Column(Enum(PledgeType), default=PledgeType.TIME_HOURS, nullable=False)
    hours_committed = Column(Integer, default=2, nullable=False)
    pledge_description = Column(Text, nullable=False)
    availability = Column(String(100), default="Flexible", nullable=False)
    status = Column(Enum(PledgeStatus), default=PledgeStatus.PENDING, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    need = relationship("Need", backref="volunteer_pledges")
