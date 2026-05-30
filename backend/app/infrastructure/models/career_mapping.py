"""
Infrastructure Model — CareerMapping
Tracks how many alumni (students who accepted an offer) from a specific
faculty+major have been accepted into each company.
"""
import uuid

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base


class CareerMappingORM(Base):
    __tablename__ = "career_mappings"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    company_id = Column(
        PGUUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    faculty = Column(String(100), nullable=False)
    major = Column(String(100), nullable=False)
    total_alumni = Column(Integer, nullable=False, default=0)

    last_updated = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Prevent duplicate rows for the same faculty+major+company triple
    __table_args__ = (
        UniqueConstraint("faculty", "major", "company_id", name="uq_career_mapping_faculty_major_company"),
    )

    # Relationships
    company = relationship("CompanyORM", foreign_keys=[company_id])
