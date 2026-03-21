import uuid
from sqlalchemy import Column, String, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base
from app.domain.entities.enums import UserRole, UserStatus


class UserORM(Base):
    __tablename__ = "users"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False)
    status = Column(SAEnum(UserStatus), nullable=False, default=UserStatus.UNVERIFIED)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    student = relationship("StudentORM", back_populates="user", uselist=False, cascade="all, delete-orphan")
    hr = relationship("HrORM", back_populates="user", uselist=False, cascade="all, delete-orphan")
    admin = relationship("AdminORM", back_populates="user", uselist=False, cascade="all, delete-orphan")
    email_notifications = relationship("EmailNotificationORM", back_populates="recipient", cascade="all, delete-orphan")
    verification_tokens = relationship("VerificationTokenORM", back_populates="user", cascade="all, delete-orphan")
