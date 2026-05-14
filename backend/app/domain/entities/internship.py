from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import WorkStatus, PaymentStatus


class Internship(BaseModel):
    id: Optional[UUID] = None
    company_id: UUID
    title: str
    description: str
    requirement: str
    benefit: str
    location: str
    industry: str
    quota: int
    work_status: WorkStatus
    payment_status: PaymentStatus
    open_date: Optional[date] = None
    close_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
