from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import ApplicationStatus


# ===================== Request Schemas =====================

class ApplicationCreateRequest(BaseModel):
    submitted_cv_id: UUID


class ApplicationStatusUpdateRequest(BaseModel):
    new_status: str


# ===================== Nested Summary Schemas =====================

class CompanyBrief(BaseModel):
    company_name: str
    photo_profile_url: Optional[str] = None

    model_config = {"from_attributes": True}


class InternshipBrief(BaseModel):
    id: UUID
    title: str
    company: Optional[CompanyBrief] = None

    model_config = {"from_attributes": True}


class OfferBrief(BaseModel):
    id: UUID
    offer_date: date
    expiry_date: date
    status: str
    offer_detail: Optional[str] = None
    compensation: Optional[str] = None
    duration: Optional[str] = None
    offering_file_url: Optional[str] = None

    model_config = {"from_attributes": True}


class StudentBrief(BaseModel):
    """Used by HR when viewing an applicant's summary in a list."""
    id: UUID
    full_name: str
    nim: str
    major: str
    application_time: Optional[datetime] = None
    status: str

    model_config = {"from_attributes": True}


class StudentDetail(BaseModel):
    """Full student profile used by HR when viewing a single applicant."""
    id: UUID
    full_name: str
    nim: str
    major: str
    faculty: Optional[str] = None
    gpa: Optional[float] = None
    phone_number: Optional[str] = None
    email: str
    skills: List[str] = []
    cv_url: Optional[str] = None
    photo_profile_url: Optional[str] = None

    model_config = {"from_attributes": True}


# ===================== History Schema =====================

class ApplicationStatusHistoryResponse(BaseModel):
    id: UUID
    previous_status: Optional[str] = None
    new_status: str
    changed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ===================== Base Application Response =====================

class ApplicationResponse(BaseModel):
    id: UUID
    student_id: UUID
    internship_id: UUID
    submitted_cv_id: UUID
    status: ApplicationStatus
    application_time: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ===================== Student-facing Response Schemas =====================

class ApplicationStats(BaseModel):
    total_applications: int
    processing_count: int
    accepted_count: int
    rejected_count: int


class StudentApplicationListItem(BaseModel):
    id: UUID
    internship: InternshipBrief
    status: str
    application_time: Optional[datetime] = None

    model_config = {"from_attributes": True}


class StudentApplicationListResponse(BaseModel):
    stats: ApplicationStats
    applications: List[StudentApplicationListItem]


class StudentApplicationDetailResponse(BaseModel):
    id: UUID
    internship: InternshipBrief
    status: str
    application_time: Optional[datetime] = None
    status_history: List[ApplicationStatusHistoryResponse] = []
    offer: Optional[OfferBrief] = None

    model_config = {"from_attributes": True}


# ===================== HR-facing Response Schemas =====================

class HRApplicantListItem(BaseModel):
    id: UUID
    student: StudentBrief
    application_time: Optional[datetime] = None
    status: str

    model_config = {"from_attributes": True}


class PaginatedHRApplicantResponse(BaseModel):
    items: List[HRApplicantListItem]
    total: int
    page: int
    limit: int
    total_pages: int


class HRApplicantDetailResponse(BaseModel):
    id: UUID
    status: str
    application_time: Optional[datetime] = None
    position: Optional[str] = None
    student: StudentDetail
    status_history: List[ApplicationStatusHistoryResponse] = []

    model_config = {"from_attributes": True}


class HRApplicantListItemWithInternship(BaseModel):
    """Like HRApplicantListItem but includes internship context — used when
    listing applicants across ALL of the HR's internships at once."""
    id: UUID
    internship_id: UUID
    internship_title: str
    student: StudentBrief
    application_time: Optional[datetime] = None
    status: str

    model_config = {"from_attributes": True}


class PaginatedHRAllApplicantResponse(BaseModel):
    items: List[HRApplicantListItemWithInternship]
    total: int
    page: int
    limit: int
    total_pages: int
