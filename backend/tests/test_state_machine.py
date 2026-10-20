from app.models.need import NeedStatus
from app.models.response import ResolutionStatus
from app.models.user import UserRole
from app.services.state_machine import can_transition_need, can_transition_resolution

def test_need_state_machine_transitions():
    # Resident cannot arbitrarily reject a need
    valid, _ = can_transition_need(NeedStatus.PUBLISHED, NeedStatus.REJECTED, UserRole.RESIDENT)
    assert not valid

    # Moderator can reject a need
    valid, _ = can_transition_need(NeedStatus.SUBMITTED, NeedStatus.REJECTED, UserRole.MODERATOR)
    assert valid

    # Published can transition to Matched
    valid, _ = can_transition_need(NeedStatus.PUBLISHED, NeedStatus.MATCHED, UserRole.RESIDENT)
    assert valid

    # Resolved can only be reopened to Assistance in Progress
    valid, _ = can_transition_need(NeedStatus.RESOLVED, NeedStatus.PUBLISHED, UserRole.RESIDENT)
    assert not valid

def test_resolution_state_machine():
    # Resident can confirm a proposed resolution
    valid, _ = can_transition_resolution(ResolutionStatus.PROPOSED, ResolutionStatus.CONFIRMED, UserRole.RESIDENT, is_resident=True)
    assert valid

    # Non-involved user cannot confirm resolution
    valid, _ = can_transition_resolution(ResolutionStatus.PROPOSED, ResolutionStatus.CONFIRMED, UserRole.RESIDENT, is_resident=False)
    assert not valid
