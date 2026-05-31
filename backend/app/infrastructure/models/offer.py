import uuid
from datetime import date as _date
from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base


class OfferORM(Base):
    __tablename__ = "offers"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)


    application_id = Column(
        PGUUID(as_uuid=True),
        ForeignKey("applications.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    offer_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)


    status = Column(String(20), nullable=False, default="Pending")

    offer_detail = Column(Text, nullable=True)
    compensation = Column(String(255), nullable=True)
    duration = Column(String(100), nullable=True)


    offering_file_id = Column(
        PGUUID(as_uuid=True),
        ForeignKey("documents.id"),
        nullable=False,
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


    application = relationship("ApplicationORM", back_populates="offer", uselist=False)
    offering_file = relationship("DocumentORM", foreign_keys=[offering_file_id])
