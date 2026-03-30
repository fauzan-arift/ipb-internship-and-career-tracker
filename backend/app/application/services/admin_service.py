import logging
from datetime import datetime, timezone
from typing import List
from uuid import UUID

from fastapi import HTTPException, status

from app.domain.entities.enums import UserStatus, CompanyVerificationStatus
from app.domain.unit_of_work import IUnitOfWork
from app.application.services.email_service import EmailService

logger = logging.getLogger(__name__)

class AdminService:

    def __init__(self, uow: IUnitOfWork, email_service: EmailService):
        self.uow = uow
        self.email_service = email_service

    async def get_pending_registrations(self) -> List[dict]:
        async with self.uow as uow:
            hrs = await uow.users.get_pending_hrs()
            result = []
            for hr in hrs:
                company = await uow.companies.get_by_hr_id(hr.profile_id)
                user = await uow.users.get_by_id(hr.id)
                result.append({
                    "hr_profile_id": hr.profile_id,
                    "hr_id": hr.profile_id,
                    "user_id": hr.id,
                    "full_name": hr.full_name,
                    "email": hr.email,
                    "position": hr.position,
                    "company_name": company.company_name if company else None,
                    "registered_at": (
                        company.registration_date.isoformat()
                        if company and company.registration_date else None
                    ),
                })
        return result

    async def get_processed_registrations(self) -> List[dict]:
        async with self.uow as uow:
            hrs = await uow.users.get_processed_hrs()
            result = []
            for hr in hrs:
                company = await uow.companies.get_by_hr_id(hr.profile_id)
                user = await uow.users.get_by_id(hr.id)
                result.append({
                    "hr_profile_id": hr.profile_id,
                    "hr_id": hr.profile_id,
                    "user_id": hr.id,
                    "full_name": hr.full_name,
                    "email": hr.email,
                    "position": hr.position,
                    "company_name": company.company_name if company else None,
                    "status": user.status.value if user else None,
                    "verified_at": (
                        company.verified_at.isoformat()
                        if company and company.verified_at else None
                    ),
                })
        return result

    async def get_hr_detail(self, hr_id: UUID) -> dict:
        async with self.uow as uow:
            hr = await uow.users.get_hr_by_id(hr_id)
            if not hr:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HR tidak ditemukan.")

            company = await uow.companies.get_by_hr_id(hr.profile_id)
            user = await uow.users.get_by_id(hr.id)

            npwp_doc = None
            download_url = None
            if company and company.npwp_document_id:
                npwp_doc = await uow.documents.get_by_id(company.npwp_document_id)
                if npwp_doc:
                    download_url = npwp_doc.file_url

        return {
            "hr": {
                "hr_profile_id": hr.profile_id,
                "hr_id": hr.profile_id,
                "user_id": hr.id,
                "full_name": hr.full_name,
                "email": hr.email,
                "position": hr.position,
                "status": user.status.value if user else None,
            },
            "company": {
                "company_id": company.id if company else None,
                "company_name": company.company_name if company else None,
                "address": company.address if company else None,
                "industry": company.industry if company else None,
                "website": company.website if company else None,
                "description": company.description if company else None,
                "company_email": company.email if company else None,
            } if company else None,
            "npwp_document": {
                "document_id": npwp_doc.id,
                "file_name": npwp_doc.file_name,
                "file_format": npwp_doc.file_format,
                "upload_date": npwp_doc.upload_date,
                "download_url": download_url,
            } if npwp_doc else None,
        }

    async def approve_hr(self, hr_id: UUID) -> bool:
        async with self.uow as uow:
            hr = await uow.users.get_hr_by_id(hr_id)
            if not hr:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HR tidak ditemukan.")

            user = await uow.users.get_by_id(hr.id)
            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User tidak ditemukan.")

            if not user.is_pending():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"User bukan dalam status PENDING (saat ini: {user.status.value})."
                )

            user = user.model_copy(update={"status": UserStatus.VERIFIED})
            await uow.users.save(user)

            company = await uow.companies.get_by_hr_id(hr.profile_id)
            if company:
                company = company.model_copy(update={
                    "verification_status": CompanyVerificationStatus.VERIFIED,
                    "verified_at": datetime.now(tz=timezone.utc),
                })
                await uow.companies.save(company)
            await uow.commit()

        company_name = company.company_name if company else ""
        await self.email_service.send_hr_approval_email(user, company_name, self.uow)
        return True

    async def reject_hr(self, hr_id: UUID, reason: str) -> bool:
        async with self.uow as uow:
            hr = await uow.users.get_hr_by_id(hr_id)
            if not hr:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HR tidak ditemukan.")

            user = await uow.users.get_by_id(hr.id)
            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User tidak ditemukan.")

            if not user.is_pending():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"User bukan dalam status PENDING (saat ini: {user.status.value})."
                )

            user = user.model_copy(update={"status": UserStatus.REJECTED})
            await uow.users.save(user)

            company = await uow.companies.get_by_hr_id(hr.profile_id)
            if company:
                company = company.model_copy(update={
                    "verification_status": CompanyVerificationStatus.REJECTED,
                })
                await uow.companies.save(company)
            await uow.commit()

        await self.email_service.send_hr_rejection_email(user, reason, self.uow)
        return True

    async def get_document_url(self, document_id: UUID) -> str:
        async with self.uow as uow:
            doc = await uow.documents.get_by_id(document_id)
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dokumen tidak ditemukan.")
        return doc.file_url
