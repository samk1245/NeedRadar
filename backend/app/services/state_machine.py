from typing import Tuple
from app.models.need import NeedStatus
from app.models.response import ResolutionStatus
from app.models.user import UserRole

# Permitted Need transitions: Current Status -> Set of allowed Next Statuses
ALLOWED_NEED_TRANSITIONS = {
    NeedStatus.SUBMITTED: {NeedStatus.UNDER_REVIEW, NeedStatus.PUBLISHED, NeedStatus.REJECTED},
    NeedStatus.UNDER_REVIEW: {NeedStatus.PUBLISHED, NeedStatus.REJECTED},
    NeedStatus.PUBLISHED: {NeedStatus.MATCHED, NeedStatus.ASSISTANCE_IN_PROGRESS, NeedStatus.CLOSED},
    NeedStatus.MATCHED: {NeedStatus.ASSISTANCE_IN_PROGRESS, NeedStatus.PUBLISHED, NeedStatus.CLOSED},
    NeedStatus.ASSISTANCE_IN_PROGRESS: {NeedStatus.RESOLUTION_PROPOSED, NeedStatus.MATCHED, NeedStatus.CLOSED},
    NeedStatus.RESOLUTION_PROPOSED: {NeedStatus.RESOLVED, NeedStatus.ASSISTANCE_IN_PROGRESS, NeedStatus.CLOSED},
    NeedStatus.RESOLVED: {NeedStatus.ASSISTANCE_IN_PROGRESS}, # Reopening permitted if recurring
    NeedStatus.CLOSED: {NeedStatus.PUBLISHED}, # Reopen closed need
    NeedStatus.REJECTED: {NeedStatus.UNDER_REVIEW, NeedStatus.PUBLISHED}, # Appeal / review
}

def can_transition_need(
    current_status: NeedStatus,
    target_status: NeedStatus,
    user_role: UserRole,
    is_creator: bool = False
) -> Tuple[bool, str]:
    if current_status == target_status:
        return True, "No change"
        
    allowed_targets = ALLOWED_NEED_TRANSITIONS.get(current_status, set())
    if target_status not in allowed_targets:
        return False, f"Cannot transition need from {current_status.value} to {target_status.value}"
        
    # Role-based constraints
    if target_status in {NeedStatus.UNDER_REVIEW, NeedStatus.REJECTED}:
        if user_role not in {UserRole.MODERATOR, UserRole.ADMIN}:
            return False, "Only moderators or admins can reject or mark for review"
            
    if target_status == NeedStatus.RESOLVED:
        if not (is_creator or user_role in {UserRole.MODERATOR, UserRole.ADMIN}):
            return False, "Only the reporting resident or an authorized moderator can confirm resolution"
            
    if target_status == NeedStatus.CLOSED:
        if not (is_creator or user_role in {UserRole.MODERATOR, UserRole.ADMIN}):
            return False, "Only the creator or a moderator can close this need"
            
    return True, "Valid transition"

# Permitted Resolution Proposal transitions
ALLOWED_RESOLUTION_TRANSITIONS = {
    ResolutionStatus.PROPOSED: {ResolutionStatus.CONFIRMED, ResolutionStatus.REJECTED, ResolutionStatus.CLARIFICATION_REQUESTED},
    ResolutionStatus.CLARIFICATION_REQUESTED: {ResolutionStatus.PROPOSED, ResolutionStatus.REJECTED},
    ResolutionStatus.REJECTED: {ResolutionStatus.PROPOSED},
    ResolutionStatus.CONFIRMED: set(), # Terminal state
}

def can_transition_resolution(
    current_status: ResolutionStatus,
    target_status: ResolutionStatus,
    user_role: UserRole,
    is_resident: bool = False
) -> Tuple[bool, str]:
    if current_status == target_status:
        return True, "No change"
        
    allowed_targets = ALLOWED_RESOLUTION_TRANSITIONS.get(current_status, set())
    if target_status not in allowed_targets:
        return False, f"Cannot transition resolution from {current_status.value} to {target_status.value}"
        
    if target_status in {ResolutionStatus.CONFIRMED, ResolutionStatus.REJECTED, ResolutionStatus.CLARIFICATION_REQUESTED}:
        if not (is_resident or user_role in {UserRole.MODERATOR, UserRole.ADMIN}):
            return False, "Only the resident or an authorized moderator can review resolution proposals"
            
    return True, "Valid transition"
