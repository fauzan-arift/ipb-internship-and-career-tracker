from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, model_validator

from app.domain.entities.enums import WorkStatus, PaymentStatus


# ===================== Nested Company Info =====================

class CompanySummary(BaseModel):
    id: UUID
    company_name: str
    industry: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None

    model_config = {"from_attributes": True}


# ===================== Request Schemas =====================

class InternshipCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    requirement: str = Field(..., min_length=5)
    benefit: str = Field(..., min_length=5)
    location: str = Field(..., max_length=255)
    industry: str = Field(..., max_length=100)
    quota: int = Field(..., ge=1)
    work_status: WorkStatus
    payment_status: PaymentStatus
    open_date: Optional[date] = None
    close_date: date
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def validate_dates(self) -> "InternshipCreateRequest":
        if self.start_date >= self.end_date:
            raise ValueError("start_date harus sebelum end_date.")
        if self.close_date > self.start_date:
            raise ValueError("close_date harus sebelum atau sama dengan start_date.")
        return self


class InternshipUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    requirement: Optional[str] = Field(None, min_length=5)
    benefit: Optional[str] = Field(None, min_length=5)
    location: Optional[str] = Field(None, max_length=255)
    industry: Optional[str] = Field(None, max_length=100)
    quota: Optional[int] = Field(None, ge=1)
    work_status: Optional[WorkStatus] = None
    payment_status: Optional[PaymentStatus] = None
    open_date: Optional[date] = None
    close_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    @model_validator(mode="after")
    def validate_dates(self) -> "InternshipUpdateRequest":
        if self.start_date and self.end_date:
            if self.start_date >= self.end_date:
                raise ValueError("start_date harus sebelum end_date.")
        if self.close_date and self.start_date:
            if self.close_date > self.start_date:
                raise ValueError("close_date harus sebelum atau sama dengan start_date.")
        return self


class InternshipReopenRequest(BaseModel):
    """Digunakan saat membuka kembali lowongan yang sudah ditutup."""
    close_date: date = Field(..., description="Batas pendaftaran baru (harus di masa depan).")

    @model_validator(mode="after")
    def validate_future_date(self) -> "InternshipReopenRequest":
        if self.close_date < date.today():
            raise ValueError("close_date harus hari ini atau di masa depan.")
        return self


# ===================== Response Schemas =====================

class InternshipListItem(BaseModel):
    id: UUID
    title: str
    location: str
    industry: str
    quota: int
    work_status: WorkStatus
    payment_status: PaymentStatus
    open_date: Optional[date] = None
    close_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool
    company: Optional[CompanySummary] = None

    model_config = {"from_attributes": True}


class InternshipDetailResponse(BaseModel):
    id: UUID
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
    is_active: bool
    company: Optional[CompanySummary] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PaginatedInternshipResponse(BaseModel):
    items: List[InternshipListItem]
    total: int
    page: int
    limit: int
    total_pages: int
