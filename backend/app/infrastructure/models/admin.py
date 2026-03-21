import uuid
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base


class AdminORM(Base):
    __tablename__ = "admins"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("UserORM", back_populates="admin")
