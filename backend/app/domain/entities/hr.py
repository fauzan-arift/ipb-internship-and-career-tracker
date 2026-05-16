from datetime import datetime
from typing import Optional
from uuid import UUID

from app.domain.entities.enums import UserRole, UserStatus
from app.domain.entities.user import User


class HR(User):
    profile_id: Optional[UUID] = None
    role: UserRole = UserRole.HR
    status: UserStatus = UserStatus.PENDING
    position: Optional[str] = None
    phone_number: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
