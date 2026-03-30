from datetime import datetime
from typing import Optional
from uuid import UUID

from app.domain.entities.enums import UserRole, UserStatus
from app.domain.entities.user import User


class Admin(User):
    id: Optional[UUID] = None
    profile_id: Optional[UUID] = None
    role: UserRole = UserRole.ADMIN
    status: UserStatus = UserStatus.VERIFIED
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
