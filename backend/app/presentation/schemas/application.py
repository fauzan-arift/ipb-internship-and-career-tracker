from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import ApplicationStatus


# ===================== Request Schemas =====================

class ApplicationCreateRequest(BaseModel):
    submitted_cv_id: UUID


# ===================== Response Schemas =====================

class ApplicationStatusHistoryResponse(BaseModel):
    id: UUID
    previous_status: Optional[str] = None
    new_status: str
    changed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ApplicationResponse(BaseModel):
    id: UUID
    student_id: UUID
    internship_id: UUID
    submitted_cv_id: UUID
    status: ApplicationStatus
    application_time: Optional[datetime] = None

    model_config = {"from_attributes": True}
