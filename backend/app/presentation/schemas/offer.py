from __future__ import annotations

from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


# ===================== Request Schemas =====================

class OfferCreateRequest(BaseModel):
    offer_date: date
    expiry_date: date
    duration: str
    compensation: str
    offer_detail: Optional[str] = None
    offering_file_id: UUID


# ===================== Response Schemas =====================

class OfferResponse(BaseModel):
    id: UUID
    application_id: UUID
    offer_date: date
    expiry_date: date
    status: str
    offer_detail: Optional[str] = None
    compensation: Optional[str] = None
    duration: Optional[str] = None
    offering_file_id: UUID
    offering_file_url: Optional[str] = None

    model_config = {"from_attributes": True}
