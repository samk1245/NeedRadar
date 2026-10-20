import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class ReportReason(str, enum.Enum):
    UNSAFE_CONTENT = "unsafe_content"
    SENSITIVE_PERSONAL_DATA = "sensitive_personal_data"
    INAPPROPRIATE_LANGUAGE = "inappropriate_language"
    SPAM_OR_FRAUD = "spam_or_fraud"
    DUPLICATE = "duplicate"
    EMERGENCY_MISUSE = "emergency_misuse"
    OTHER = "other"

class ModerationReport(Base):
    __tablename__ = "moderation_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    need_id = Column(String(36), ForeignKey("needs.id", ondelete="CASCADE"), nullable=False)
    reporter_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reason = Column(Enum(ReportReason), default=ReportReason.OTHER, nullable=False)
    details = Column(Text, nullable=True)
    status = Column(String(30), default="pending", nullable=False) # pending, reviewed, dismissed, actioned
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    need = relationship("Need", back_populates="moderation_reports")

class ModerationAction(Base):
    __tablename__ = "moderation_actions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    target_type = Column(String(50), nullable=False) # need, organisation, user, response
    target_id = Column(String(36), nullable=False)
    action_type = Column(String(50), nullable=False) # approve, reject, hide, clarify, merge, verify_org, revoke_org, suspend_user
    reason = Column(Text, nullable=False)
    state_before = Column(JSON, nullable=True)
    state_after = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    actor = relationship("User", back_populates="moderation_actions")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    user_email = Column(String(255), nullable=True)
    user_role = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(36), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
