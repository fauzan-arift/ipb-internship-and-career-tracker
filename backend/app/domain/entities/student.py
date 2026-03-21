from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import UserRole, UserStatus


class Student(BaseModel):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    full_name: str
    email: str
    password_hash: str
    role: UserRole = UserRole.STUDENT
    status: UserStatus = UserStatus.UNVERIFIED
    nim: str
    major: str
    faculty: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None
    phone_number: Optional[str] = None
    skills: List[str] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
