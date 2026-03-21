"""
Domain Entity — VerificationToken
Pure Pydantic BaseModel. No SQLAlchemy, no FastAPI imports.
"""
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import TokenType


class VerificationToken(BaseModel):
    id: Optional[UUID] = None
    user_id: UUID
    token_hash: str
    expires_at: datetime
    is_used: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

    def is_expired(self) -> bool:
        expires = self.expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        return datetime.now(tz=timezone.utc) > expires
