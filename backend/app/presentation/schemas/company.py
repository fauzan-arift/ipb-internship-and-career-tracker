"""
Company / HR profile Pydantic schemas.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.domain.entities.enums import CompanyVerificationStatus

class CompanyProfileUpdateRequest(BaseModel):
    """HR can update these company fields. All are optional (partial update)."""
    company_name: Optional[str] = Field(None, min_length=2, max_length=255)
    address: Optional[str] = Field(None, max_length=500)
    industry: Optional[str] = Field(None, max_length=100)
    website: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    photo_profile_id: Optional[UUID] = None


class CompanyProfileResponse(BaseModel):
    """Full company profile returned from GET/PUT company-profile endpoints."""
    id: UUID
    hr_id: UUID
    company_name: str
    address: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    email: Optional[str] = None
    npwp_document_id: Optional[UUID] = None
    photo_profile_id: Optional[UUID] = None
    photo_profile_url: Optional[str] = None
    verification_status: CompanyVerificationStatus
    verified_at: Optional[datetime] = None
    registration_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}



class HRProfileResponse(BaseModel):
    """HR's own personal profile (not the company profile)."""
    id: UUID                          # users.id
    full_name: str
    email: str
    position: Optional[str] = None
    phone_number: Optional[str] = None

    model_config = {"from_attributes": True}


class HRProfileUpdateRequest(BaseModel):
    """Partial update of the HR's personal profile. All fields optional."""
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    position: Optional[str] = Field(None, max_length=100)
    phone_number: Optional[str] = Field(None, max_length=20)