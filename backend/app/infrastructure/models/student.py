import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base


class StudentORM(Base):
    __tablename__ = "students"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    nim = Column(String(20), unique=True, nullable=False, index=True)
    major = Column(String(100), nullable=False)
    faculty = Column(String(100), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    gpa = Column(Float, nullable=True)
    phone_number = Column(String(20), nullable=True)
    # skills column removed in favor of many-to-many relationship

    # Document FKs
    cv_id = Column(PGUUID(as_uuid=True), ForeignKey("documents.id"), nullable=True)
    photo_profile_id = Column(PGUUID(as_uuid=True), ForeignKey("documents.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("UserORM", back_populates="student")
    applications = relationship("ApplicationORM", back_populates="student", cascade="all, delete-orphan")
    cv_document = relationship("DocumentORM", foreign_keys=[cv_id])
    photo_profile = relationship("DocumentORM", foreign_keys=[photo_profile_id])
    skills = relationship("SkillORM", secondary="student_skills", back_populates="students")
