import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class NotificationType(str, enum.Enum):
    NEW_RESPONSE = "new_response"
    STATUS_CHANGE = "status_change"
    RESOLUTION_PROPOSED = "resolution_proposed"
    RESOLUTION_CONFIRMED = "resolution_confirmed"
    VERIFICATION_UPDATE = "verification_update"
    DUPLICATE_SUGGESTION = "duplicate_suggestion"
    CLARIFICATION_NEEDED = "clarification_needed"
    MATCHING_OPPORTUNITY = "matching_opportunity"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(Enum(NotificationType), nullable=False)
    link_url = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    payload = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="notifications")
