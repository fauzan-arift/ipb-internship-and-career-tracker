from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import ApplicationStatus


class Application(BaseModel):
    id: Optional[UUID] = None
    student_id: UUID
    internship_id: UUID
    submitted_cv_id: UUID
    status: ApplicationStatus = ApplicationStatus.PENDING
    application_time: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ApplicationStatusHistory(BaseModel):
    id: Optional[UUID] = None
    application_id: UUID
    previous_status: Optional[str] = None
    new_status: str
    changed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
