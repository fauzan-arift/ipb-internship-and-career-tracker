"""
Domain Entity — CareerMapping
Pydantic model representing a career mapping record in the domain layer.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class CareerMapping(BaseModel):
    id: Optional[UUID] = None
    faculty: str
    major: str
    company_id: UUID
    total_alumni: int = 0
    last_updated: Optional[datetime] = None

    model_config = {"from_attributes": True}
