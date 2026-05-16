from __future__ import annotations
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.domain.entities.enums import UserRole, UserStatus


class StudentRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    nim: str = Field(..., min_length=5, max_length=20)
    major: str = Field(..., min_length=2, max_length=100)
    faculty: Optional[str] = Field(None, max_length=100)
    graduation_year: Optional[int] = Field(None, ge=2000, le=2100)
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    phone_number: Optional[str] = Field(None, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator("nim")
    @classmethod
    def validate_nim(cls, v: str) -> str:
        if len(v) != 11:
            raise ValueError("NIM harus tepat 11 karakter.")
        if not v[0].isalpha():
            raise ValueError("NIM harus diawali huruf.")
        if not v[1:].isdigit():
            raise ValueError("NIM harus berformat 1 huruf + 10 digit (contoh: G6401231040).")
        return v.upper()

    @field_validator("email")
    @classmethod
    def validate_student_email_domain(cls, v: EmailStr) -> EmailStr:
        if not str(v).lower().endswith("@apps.ipb.ac.id"):
            raise ValueError("Email student harus menggunakan domain @apps.ipb.ac.id.")
        return v


class HRRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    position: Optional[str] = Field(None, max_length=100)
    phone_number: Optional[str] = Field(None, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    company_name: str = Field(..., min_length=2, max_length=255)
    address: Optional[str] = Field(None, max_length=500)
    industry: Optional[str] = Field(None, max_length=100)
    website: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    company_email: Optional[EmailStr] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


# ==================== Responses ====================

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: Optional[str] = None


class UserInfoResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: UserRole
    status: UserStatus
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfoResponse
