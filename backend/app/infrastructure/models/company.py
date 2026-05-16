import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base
from app.domain.entities.enums import CompanyVerificationStatus


class CompanyORM(Base):
    __tablename__ = "companies"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    hr_id = Column(PGUUID(as_uuid=True), ForeignKey("hrs.id"), unique=True, nullable=False)
    npwp_document_id = Column(PGUUID(as_uuid=True), ForeignKey("documents.id"), nullable=True)
    photo_profile_id = Column(PGUUID(as_uuid=True), ForeignKey("documents.id"), nullable=True)

    company_name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=True)
    industry = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    email = Column(String(255), nullable=True)

    verification_status = Column(
        SAEnum(CompanyVerificationStatus, native_enum=False),
        nullable=False,
        default=CompanyVerificationStatus.PENDING,
    )
    verified_at = Column(DateTime(timezone=True), nullable=True)
    registration_date = Column(DateTime(timezone=True), server_default=func.now())

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    hr = relationship("HrORM", back_populates="company")
    npwp_document = relationship("DocumentORM", foreign_keys=[npwp_document_id])
    photo_profile = relationship("DocumentORM", foreign_keys=[photo_profile_id])
    internships = relationship("InternshipORM", back_populates="company", cascade="all, delete-orphan")
