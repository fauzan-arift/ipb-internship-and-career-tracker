from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import EmailNotificationStatus


class EmailNotification(BaseModel):
    id: Optional[UUID] = None
    recipient_id: UUID
    subject: str
    body: str
    sent_at: Optional[datetime] = None
    status: EmailNotificationStatus = EmailNotificationStatus.SENT
    reference_id: Optional[str] = None
    reference_type: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
