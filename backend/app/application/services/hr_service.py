"""
HrService — handles HR/Company-facing profile operations.
"""
import logging
from typing import Optional
from uuid import UUID

from fastapi import HTTPException, status

from app.domain.unit_of_work import IUnitOfWork

logger = logging.getLogger(__name__)


async def _resolve_url(uow, doc_id: Optional[UUID]) -> Optional[str]:
    """Look up a document by ID and return its file_url, or None."""
    if not doc_id:
        return None
    doc = await uow.documents.get_by_id(doc_id)
    return doc.file_url if doc else None


class HrService:

    def __init__(self, uow: IUnitOfWork):
        self.uow = uow

    async def get_company_profile(self, hr_user_id: UUID):
        """Return the company profile linked to the authenticated HR user."""
        async with self.uow as uow:
            hr = await uow.users.get_hr_by_user_id(hr_user_id)
            if not hr:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profil HR tidak ditemukan.",
                )
            company = await uow.companies.get_by_hr_id(hr.profile_id)
            if not company:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profil perusahaan tidak ditemukan.",
                )
            photo_url = await _resolve_url(uow, company.photo_profile_id)

        return company, photo_url

    async def update_company_profile(self, hr_user_id: UUID, payload: dict):
        """
        Partial update of the Company record linked to the authenticated HR.
        Validates photo_profile_id if provided, then persists changes.
        """
        async with self.uow as uow:
            hr = await uow.users.get_hr_by_user_id(hr_user_id)
            if not hr:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profil HR tidak ditemukan.",
                )

            company = await uow.companies.get_by_hr_id(hr.profile_id)
            if not company:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profil perusahaan tidak ditemukan.",
                )

            # Validate photo_profile_id if provided
            if "photo_profile_id" in payload and payload["photo_profile_id"] is not None:
                doc = await uow.documents.get_by_id(payload["photo_profile_id"])
                if not doc:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Dokumen foto profil tidak ditemukan. Upload terlebih dahulu.",
                    )

            # Apply partial updates to the company domain entity
            updated_company = company.model_copy(update=payload)
            saved = await uow.companies.save(updated_company)
            await uow.commit()

            photo_url = await _resolve_url(uow, saved.photo_profile_id)

        return saved, photo_url

    async def get_hr_profile(self, hr_user_id: UUID):
        """Return the HR's own personal profile (name, position, phone_number)."""
        async with self.uow as uow:
            hr = await uow.users.get_hr_by_user_id(hr_user_id)
            if not hr:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profil HR tidak ditemukan.",
                )
        return hr

    async def update_hr_profile(self, hr_user_id: UUID, payload: dict):
        """
        Partial update of the HR's personal profile fields:
        full_name, position, phone_number.
        """
        async with self.uow as uow:
            hr = await uow.users.get_hr_by_user_id(hr_user_id)
            if not hr:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profil HR tidak ditemukan.",
                )
            updated_hr = await uow.users.update_hr_profile(hr_user_id, payload)
            if not updated_hr:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Gagal memperbarui profil HR.",
                )
            await uow.commit()
        return updated_hr
