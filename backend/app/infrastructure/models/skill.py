import uuid
from sqlalchemy import Column, String, DateTime, Table, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.infrastructure.database import Base

student_skills = Table(
    "student_skills",
    Base.metadata,
    Column("student_id", PGUUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", PGUUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

class SkillORM(Base):
    __tablename__ = "skills"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    students = relationship("StudentORM", secondary=student_skills, back_populates="skills")
