import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text, Float, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base

class OrgType(str, enum.Enum):
    NGO = "ngo"
    COMMUNITY_GROUP = "community_group"
    SERVICE_PROVIDER = "service_provider"
    VOLUNTEER_NETWORK = "volunteer_network"

class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    VERIFIED = "verified"
    REJECTED = "rejected"
    SUSPENDED = "suspended"

class Organisation(Base):
    __tablename__ = "organisations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), index=True, nullable=False)
    description = Column(Text, nullable=False)
    org_type = Column(Enum(OrgType), default=OrgType.NGO, nullable=False)
    registration_number = Column(String(100), nullable=True) # NGO Darpan / 80G / CIN
    website_url = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50), nullable=True)
    city = Column(String(100), default="Bengaluru", nullable=False)
    service_area = Column(String(255), nullable=False) # e.g., "Koramangala, HSR Layout, BTM"
    operating_hours = Column(String(100), default="Mon-Sat, 9am - 6pm")
    capacity_description = Column(Text, nullable=True)
    eligibility_criteria = Column(Text, nullable=True)
    
    # Verification
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False)
    verification_notes = Column(Text, nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    
    # Audit
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    members = relationship("OrganisationMember", back_populates="organisation", cascade="all, delete-orphan")
    responses = relationship("ProviderResponse", back_populates="organisation", cascade="all, delete-orphan")
    services = relationship("ServiceOffering", back_populates="organisation", cascade="all, delete-orphan")

class OrganisationMember(Base):
    __tablename__ = "organisation_members"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), default="admin", nullable=False) # admin, member
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    organisation = relationship("Organisation", back_populates="members")
    user = relationship("User", back_populates="organisation_memberships")

class ServiceOffering(Base):
    __tablename__ = "service_offerings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), nullable=False) # Maps to NeedCategory
    subcategories = Column(Text, nullable=True) # Comma-separated
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    organisation = relationship("Organisation", back_populates="services")
