from __future__ import annotations

from datetime import date
from typing import List, Literal, Optional
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


# ===================== Student Offer Response Schemas =====================

class OfferInternshipBrief(BaseModel):
    """Minimal internship info embedded in an offer card."""
    title: str
    company_name: str
    location: str
    photo_profile_url: Optional[str] = None


class StudentOfferListItem(BaseModel):
    """One offer card shown in the student's offer list."""
    id: UUID
    offer_date: date
    expiry_date: date
    compensation: Optional[str] = None
    duration: Optional[str] = None
    offer_detail: Optional[str] = None
    offering_file_url: Optional[str] = None
    internship: OfferInternshipBrief
    status: str  # Pending | Accepted | Rejected

    model_config = {"from_attributes": True}


class StudentOfferListResponse(BaseModel):
    offers: List[StudentOfferListItem]


# ===================== Student Offer Action Schemas =====================

class OfferRespondRequest(BaseModel):
    """Body for PATCH /students/offers/{offer_id}/respond."""
    response_status: Literal["Accepted", "Rejected"]
