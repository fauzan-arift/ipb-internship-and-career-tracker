import uuid
from datetime import date as _date
from sqlalchemy import Column, String, Text, Integer, Boolean, Date, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base
from app.domain.entities.enums import WorkStatus, PaymentStatus


class InternshipORM(Base):
    __tablename__ = "internships"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    company_id = Column(PGUUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirement = Column(Text, nullable=False)
    benefit = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    industry = Column(String(100), nullable=False)
    quota = Column(Integer, nullable=False)

    work_status = Column(SAEnum(WorkStatus, native_enum=False), nullable=False)
    payment_status = Column(SAEnum(PaymentStatus, native_enum=False), nullable=False)

    open_date = Column(Date, nullable=True, server_default=func.current_date())
    close_date = Column(Date, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("CompanyORM", back_populates="internships")
    applications = relationship(
        "ApplicationORM",
        back_populates="internship",
        cascade="all, delete-orphan",
    )
