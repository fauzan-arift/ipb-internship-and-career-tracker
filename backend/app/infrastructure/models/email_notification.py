import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.infrastructure.database import Base
from app.domain.entities.enums import EmailNotificationStatus


class EmailNotificationORM(Base):
    __tablename__ = "email_notifications"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    recipient_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(SAEnum(EmailNotificationStatus), nullable=False, default=EmailNotificationStatus.SENT)
    reference_id = Column(String(255), nullable=True)
    reference_type = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    recipient = relationship("UserORM", back_populates="email_notifications")
