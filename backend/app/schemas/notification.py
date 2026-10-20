from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, ConfigDict
from app.models.notification import NotificationType

class NotificationRead(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    notification_type: NotificationType
    link_url: Optional[str] = None
    is_read: bool
    payload: Optional[Dict[str, Any]] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
