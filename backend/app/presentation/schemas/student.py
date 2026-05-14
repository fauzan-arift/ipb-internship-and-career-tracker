"""
Student profile Pydantic schemas.
"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.domain.entities.enums import UserRole, UserStatus


class StudentProfileUpdateRequest(BaseModel):
    """All fields are optional — only provided fields are updated (partial update)."""
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    nim: Optional[str] = Field(None, max_length=20)
    faculty: Optional[str] = Field(None, max_length=100)
    major: Optional[str] = Field(None, max_length=100)
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    graduation_year: Optional[int] = Field(None, ge=2000, le=2100)
    phone_number: Optional[str] = Field(None, max_length=20)
    skills: Optional[List[str]] = None
    cv_id: Optional[UUID] = None
    photo_profile_id: Optional[UUID] = None


class StudentProfileResponse(BaseModel):
    """Full student profile response returned from GET/PUT profile endpoints."""
    id: UUID                          # users.id
    profile_id: Optional[UUID] = None # students.id
    full_name: str
    email: str
    role: UserRole
    status: UserStatus
    nim: str
    faculty: Optional[str] = None
    major: str
    gpa: Optional[float] = None
    graduation_year: Optional[int] = None
    phone_number: Optional[str] = None
    skills: List[str] = []
    cv_id: Optional[UUID] = None
    cv_url: Optional[str] = None
    photo_profile_id: Optional[UUID] = None
    photo_profile_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
