import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    RESIDENT = "resident"
    PROVIDER = "provider"
    NGO = "ngo"
    MODERATOR = "moderator"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.RESIDENT, nullable=False)
    city = Column(String(100), default="Bengaluru", nullable=False)
    preferred_locality = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    needs = relationship("Need", back_populates="creator", cascade="all, delete-orphan")
    supports = relationship("NeedSupporter", back_populates="user", cascade="all, delete-orphan")
    follows = relationship("NeedFollow", back_populates="user", cascade="all, delete-orphan")
    organisation_memberships = relationship("OrganisationMember", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    moderation_actions = relationship("ModerationAction", back_populates="actor")
