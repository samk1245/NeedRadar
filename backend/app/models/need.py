import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text, Float, Integer, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class NeedCategory(str, enum.Enum):
    EDUCATION = "education"
    HEALTHCARE = "healthcare"
    SUPPLIES = "supplies"
    INFRASTRUCTURE = "infrastructure"
    REPAIRS = "repairs"
    SHELTER = "shelter"

class NeedUrgency(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class NeedScope(str, enum.Enum):
    INDIVIDUAL = "individual"
    COMMUNITY = "community"

class NeedStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    PUBLISHED = "published"
    MATCHED = "matched"
    ASSISTANCE_IN_PROGRESS = "assistance_in_progress"
    RESOLUTION_PROPOSED = "resolution_proposed"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REJECTED = "rejected"

class Need(Base):
    __tablename__ = "needs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(Enum(NeedCategory), nullable=False, index=True)
    subcategory = Column(String(100), nullable=True)
    urgency = Column(Enum(NeedUrgency), default=NeedUrgency.MEDIUM, nullable=False)
    scope = Column(Enum(NeedScope), default=NeedScope.COMMUNITY, nullable=False)
    affected_count = Column(Integer, default=1, nullable=False)
    desired_timeframe = Column(String(100), default="Within 2 weeks")
    
    # Image / Attachments
    image_url = Column(String(500), nullable=True)
    
    # Location
    city = Column(String(100), default="Bengaluru", nullable=False, index=True)
    locality = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_location_approximate = Column(Boolean, default=False, nullable=False)
    approx_latitude = Column(Float, nullable=True)
    approx_longitude = Column(Float, nullable=True)
    
    # Privacy & Safety
    is_sensitive = Column(Boolean, default=False, nullable=False)
    public_contact_preference = Column(String(50), default="in_app") # in_app, masked_email
    
    # Lifecycle
    status = Column(Enum(NeedStatus), default=NeedStatus.PUBLISHED, nullable=False, index=True)
    rejection_reason = Column(Text, nullable=True)
    
    # Demand metrics cache
    supporters_count = Column(Integer, default=0, nullable=False)
    unmet_demand_score = Column(Float, default=10.0, nullable=False)
    is_demo = Column(Boolean, default=False, nullable=False)
    
    # Creator
    creator_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    creator = relationship("User", back_populates="needs")
    supporters = relationship("NeedSupporter", back_populates="need", cascade="all, delete-orphan")
    followers = relationship("NeedFollow", back_populates="need", cascade="all, delete-orphan")
    responses = relationship("ProviderResponse", back_populates="need", cascade="all, delete-orphan")
    resolution_proposals = relationship("ResolutionProposal", back_populates="need", cascade="all, delete-orphan")
    status_history = relationship("NeedStatusHistory", back_populates="need", cascade="all, delete-orphan", order_by="NeedStatusHistory.created_at.desc()")
    moderation_reports = relationship("ModerationReport", back_populates="need", cascade="all, delete-orphan")

class NeedSupporter(Base):
    __tablename__ = "need_supporters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    need_id = Column(String(36), ForeignKey("needs.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_public = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (UniqueConstraint("need_id", "user_id", name="uq_need_user_support"),)

    need = relationship("Need", back_populates="supporters")
    user = relationship("User", back_populates="supports")

class NeedFollow(Base):
    __tablename__ = "need_follows"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    need_id = Column(String(36), ForeignKey("needs.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (UniqueConstraint("need_id", "user_id", name="uq_need_user_follow"),)

    need = relationship("Need", back_populates="followers")
    user = relationship("User", back_populates="follows")

class NeedStatusHistory(Base):
    __tablename__ = "need_status_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    need_id = Column(String(36), ForeignKey("needs.id", ondelete="CASCADE"), nullable=False)
    old_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    actor_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    need = relationship("Need", back_populates="status_history")

class DuplicateCandidate(Base):
    __tablename__ = "duplicate_candidates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    need_id = Column(String(36), ForeignKey("needs.id", ondelete="CASCADE"), nullable=False)
    potential_duplicate_of_id = Column(String(36), ForeignKey("needs.id", ondelete="CASCADE"), nullable=False)
    similarity_score = Column(Float, nullable=False) # 0.0 to 1.0
    algorithm = Column(String(50), default="text_and_geo") # text_and_geo, llm_semantic
    status = Column(String(30), default="pending") # pending, confirmed, rejected
    reviewed_by = Column(String(36), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
