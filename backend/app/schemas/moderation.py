from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict
from app.models.moderation import ReportReason

class ModerationReportCreate(BaseModel):
    need_id: str
    reason: ReportReason
    details: Optional[str] = Field(None, max_length=1000)

class ModerationReportRead(BaseModel):
    id: str
    need_id: str
    reporter_id: Optional[str] = None
    reason: ReportReason
    details: Optional[str] = None
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ModerationActionCreate(BaseModel):
    target_type: str
    target_id: str
    action_type: str
    reason: str
    state_before: Optional[Dict[str, Any]] = None
    state_after: Optional[Dict[str, Any]] = None

class ModerationActionRead(BaseModel):
    id: str
    actor_id: Optional[str] = None
    actor_name: Optional[str] = None
    target_type: str
    target_id: str
    action_type: str
    reason: str
    state_before: Optional[Dict[str, Any]] = None
    state_after: Optional[Dict[str, Any]] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DuplicateMergeRequest(BaseModel):
    primary_need_id: str
    duplicate_need_id: str
    reason: str
