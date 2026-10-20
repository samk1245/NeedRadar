import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text, Float, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base

class ResponseType(str, enum.Enum):
    ACKNOWLEDGEMENT = "acknowledgement"
    PROPOSED_ASSISTANCE = "proposed_assistance"
    REFERRAL = "referral"

class ResponseStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    WITHDRAWN = "withdrawn"

class ResolutionStatus(str, enum.Enum):
    PROPOSED = "proposed"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    CLARIFICATION_REQUESTED = "clarification_requested"

class ProviderResponse(Base):
    __tablename__ = "provider_responses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    need_id = Column(String(36), ForeignKey("needs.id", ondelete="CASCADE"), nullable=False)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False)
    responder_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    response_type = Column(Enum(ResponseType), default=ResponseType.PROPOSED_ASSISTANCE, nullable=False)
    status = Column(Enum(ResponseStatus), default=ResponseStatus.SUBMITTED, nullable=False)
    
    message = Column(Text, nullable=False)
    proposed_assistance = Column(Text, nullable=True)
    eligibility_requirements = Column(Text, nullable=True)
    estimated_timeline = Column(String(100), default="1-3 business days")
    contact_instructions = Column(Text, nullable=False)
    
    resident_feedback = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    need = relationship("Need", back_populates="responses")
    organisation = relationship("Organisation", back_populates="responses")
    proposals = relationship("ResolutionProposal", back_populates="response", cascade="all, delete-orphan")

class ResolutionProposal(Base):
    __tablename__ = "resolution_proposals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    need_id = Column(String(36), ForeignKey("needs.id", ondelete="CASCADE"), nullable=False)
    response_id = Column(String(36), ForeignKey("provider_responses.id", ondelete="SET NULL"), nullable=True)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False)
    proposer_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    summary = Column(Text, nullable=False)
    evidence_notes = Column(Text, nullable=True)
    completion_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    status = Column(Enum(ResolutionStatus), default=ResolutionStatus.PROPOSED, nullable=False)
    
    resident_feedback = Column(Text, nullable=True)
    verified_by_moderator_id = Column(String(36), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    need = relationship("Need", back_populates="resolution_proposals")
    response = relationship("ProviderResponse", back_populates="proposals")
