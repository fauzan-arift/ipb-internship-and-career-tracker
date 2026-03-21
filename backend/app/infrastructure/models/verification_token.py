import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base
from app.domain.entities.enums import TokenType


class VerificationTokenORM(Base):
    __tablename__ = "verification_tokens"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(64), unique=True, nullable=False, index=True)
    token_type = Column(SAEnum(TokenType), nullable=False, default=TokenType.EMAIL_VERIFICATION)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("UserORM", back_populates="verification_tokens")
