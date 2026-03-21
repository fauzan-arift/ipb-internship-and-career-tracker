from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import UserRole, UserStatus


class HR(BaseModel):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    full_name: str
    email: str
    password_hash: str
    role: UserRole = UserRole.HR
    status: UserStatus = UserStatus.PENDING
    position: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
