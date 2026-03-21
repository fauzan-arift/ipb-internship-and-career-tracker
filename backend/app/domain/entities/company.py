from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.enums import CompanyVerificationStatus


class Company(BaseModel):
    id: Optional[UUID] = None
    hr_id: UUID
    company_name: str
    address: Optional[str] = None
    verification_status: CompanyVerificationStatus = CompanyVerificationStatus.PENDING
    verified_at: Optional[datetime] = None
    registration_date: Optional[datetime] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    email: Optional[str] = None
    npwp_document_id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

    def is_verified(self) -> bool:
        return self.verification_status == CompanyVerificationStatus.VERIFIED

    def is_pending(self) -> bool:
        return self.verification_status == CompanyVerificationStatus.PENDING

    def is_rejected(self) -> bool:
        return self.verification_status == CompanyVerificationStatus.REJECTED

    def has_npwp(self) -> bool:
        return self.npwp_document_id is not None
