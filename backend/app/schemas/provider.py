from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from app.models.organisation import OrgType, VerificationStatus
from app.models.response import ResponseType, ResponseStatus, ResolutionStatus

class OrganisationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=20)
    org_type: OrgType = OrgType.NGO
    registration_number: Optional[str] = None
    website_url: Optional[str] = None
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    city: str = "Bengaluru"
    service_area: str = "Koramangala, Indiranagar, HSR Layout"
    operating_hours: str = "Mon-Sat, 9am - 6pm"
    capacity_description: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    categories: List[str] = ["education", "supplies"]

class OrganisationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    registration_number: Optional[str] = None
    website_url: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    service_area: Optional[str] = None
    operating_hours: Optional[str] = None
    capacity_description: Optional[str] = None
    eligibility_criteria: Optional[str] = None

class OrganisationVerificationAction(BaseModel):
    status: VerificationStatus
    notes: Optional[str] = None

class OrganisationRead(BaseModel):
    id: str
    name: str
    description: str
    org_type: OrgType
    registration_number: Optional[str] = None
    website_url: Optional[str] = None
    contact_email: str
    contact_phone: Optional[str] = None
    city: str
    service_area: str
    operating_hours: str
    capacity_description: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    verification_status: VerificationStatus
    verification_notes: Optional[str] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProviderResponseCreate(BaseModel):
    response_type: ResponseType = ResponseType.PROPOSED_ASSISTANCE
    message: str = Field(..., min_length=10, max_length=2000)
    proposed_assistance: Optional[str] = None
    eligibility_requirements: Optional[str] = None
    estimated_timeline: str = "1-3 business days"
    contact_instructions: str = Field(..., min_length=5, max_length=1000)

class ProviderResponseStatusUpdate(BaseModel):
    status: ResponseStatus
    resident_feedback: Optional[str] = None

class ProviderResponseRead(BaseModel):
    id: str
    need_id: str
    organisation_id: str
    organisation_name: Optional[str] = None
    responder_id: Optional[str] = None
    response_type: ResponseType
    status: ResponseStatus
    message: str
    proposed_assistance: Optional[str] = None
    eligibility_requirements: Optional[str] = None
    estimated_timeline: str
    contact_instructions: str
    resident_feedback: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ResolutionProposalCreate(BaseModel):
    summary: str = Field(..., min_length=15, max_length=3000)
    evidence_notes: Optional[str] = None

class ResolutionProposalReview(BaseModel):
    status: ResolutionStatus # CONFIRMED, REJECTED, CLARIFICATION_REQUESTED
    feedback: Optional[str] = None

class ResolutionProposalRead(BaseModel):
    id: str
    need_id: str
    response_id: Optional[str] = None
    organisation_id: str
    organisation_name: Optional[str] = None
    summary: str
    evidence_notes: Optional[str] = None
    completion_date: Optional[datetime] = None
    status: ResolutionStatus
    resident_feedback: Optional[str] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
