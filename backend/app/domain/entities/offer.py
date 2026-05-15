from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class Offer(BaseModel):
    id: Optional[UUID] = None
    application_id: UUID
    offer_date: date
    expiry_date: date
    status: str = "Pending"
    offer_detail: Optional[str] = None
    compensation: Optional[str] = None
    duration: Optional[str] = None
    offering_file_id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
