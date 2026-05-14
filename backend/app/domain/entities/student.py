from datetime import datetime
from typing import List, Optional
from uuid import UUID

from app.domain.entities.enums import UserRole, UserStatus
from app.domain.entities.user import User


class Student(User):
    profile_id: Optional[UUID] = None
    role: UserRole = UserRole.STUDENT
    status: UserStatus = UserStatus.UNVERIFIED
    nim: str
    major: str
    faculty: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None
    phone_number: Optional[str] = None
    skills: List[str] = []
    cv_id: Optional[UUID] = None
    photo_profile_id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
