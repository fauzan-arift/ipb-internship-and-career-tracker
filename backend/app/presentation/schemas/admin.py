from __future__ import annotations
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class PendingHRItem(BaseModel):
    hr_profile_id: Optional[UUID] = None
    hr_id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    full_name: str
    email: str
    position: Optional[str] = None
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    registered_at: Optional[str] = None


class ProcessedHRItem(PendingHRItem):
    """Extends PendingHRItem with status and verified_at for the HR history list."""
    status: Optional[str] = None
    verified_at: Optional[str] = None


class HRInfo(BaseModel):
    hr_profile_id: Optional[UUID] = None
    hr_id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    full_name: str
    email: str
    position: Optional[str] = None
    phone_number: Optional[str] = None
    status: Optional[str] = None


class CompanyInfo(BaseModel):
    company_id: Optional[UUID] = None
    company_name: Optional[str] = None
    address: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    company_email: Optional[str] = None
    registration_date: Optional[datetime] = None
    verified_at: Optional[datetime] = None


class NPWPDocumentInfo(BaseModel):
    document_id: Optional[UUID] = None
    file_name: Optional[str] = None
    file_format: Optional[str] = None
    upload_date: Optional[datetime] = None
    download_url: Optional[str] = None


class HRDetail(BaseModel):
    hr: Optional[HRInfo] = None
    company: Optional[CompanyInfo] = None
    npwp_document: Optional[NPWPDocumentInfo] = None


class RejectRequest(BaseModel):
    reason: str
