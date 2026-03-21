from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import UserRole, UserStatus


class User(BaseModel):
    id: Optional[UUID] = None
    full_name: str
    email: str
    password_hash: str
    role: UserRole
    status: UserStatus = UserStatus.UNVERIFIED
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

    def is_verified(self) -> bool:
        return self.status == UserStatus.VERIFIED

    def is_unverified(self) -> bool:
        return self.status == UserStatus.UNVERIFIED

    def is_pending(self) -> bool:
        return self.status == UserStatus.PENDING

    def is_rejected(self) -> bool:
        return self.status == UserStatus.REJECTED

    def can_login(self) -> bool:
        return self.status == UserStatus.VERIFIED

    def login_blocked_reason(self) -> Optional[str]:
        reasons = {
            UserStatus.UNVERIFIED: "Silakan verifikasi email kamu terlebih dahulu.",
            UserStatus.PENDING: "Akun kamu sedang menunggu persetujuan admin.",
            UserStatus.REJECTED: "Registrasi kamu telah ditolak. Hubungi admin untuk informasi lebih lanjut.",
        }
        return reasons.get(self.status)

    def needs_email_verification(self) -> bool:
        return self.status == UserStatus.UNVERIFIED

    def has_role(self, role: UserRole) -> bool:
        return self.role == role
