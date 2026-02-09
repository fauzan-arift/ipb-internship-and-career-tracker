from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.domain.entities.user import UserRole


# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


# Registration schemas (tanpa role - auto-assigned by endpoint)
class UserRegisterStudent(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8, max_length=72)
    nim: str
    major: str


class UserRegisterCompany(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8, max_length=72)
    company_name: str
    company_address: str
    company_phone: str


class UserRegisterAdmin(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8, max_length=72)


# Login schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Response schemas
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    nim: Optional[str] = None
    major: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_phone: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# Token schema 
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
