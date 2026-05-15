import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base
from app.domain.entities.enums import ApplicationStatus


class ApplicationORM(Base):
    __tablename__ = "applications"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    student_id = Column(PGUUID(as_uuid=True), ForeignKey("students.id"), nullable=False, index=True)
    internship_id = Column(PGUUID(as_uuid=True), ForeignKey("internships.id"), nullable=False, index=True)
    submitted_cv_id = Column(PGUUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)

    status = Column(SAEnum(ApplicationStatus), nullable=False, default=ApplicationStatus.PENDING)
    application_time = Column(DateTime(timezone=True), server_default=func.now())

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("StudentORM", back_populates="applications")
    internship = relationship("InternshipORM", back_populates="applications")
    cv = relationship("DocumentORM", foreign_keys=[submitted_cv_id])
    status_histories = relationship(
        "ApplicationStatusHistoryORM",
        back_populates="application",
        cascade="all, delete-orphan",
        order_by="ApplicationStatusHistoryORM.changed_at",
    )
    offer = relationship(
        "OfferORM",
        back_populates="application",
        uselist=False,
        cascade="all, delete-orphan",
    )


class ApplicationStatusHistoryORM(Base):
    __tablename__ = "application_status_histories"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    application_id = Column(PGUUID(as_uuid=True), ForeignKey("applications.id"), nullable=False, index=True)
    previous_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    application = relationship("ApplicationORM", back_populates="status_histories")
