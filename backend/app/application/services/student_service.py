"""
StudentService — handles student-facing profile operations.
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


class StudentService:

    def __init__(self, uow: IUnitOfWork):
        self.uow = uow

    async def get_profile(self, user_id: UUID):
        """Return the authenticated student's full profile + resolved URLs."""
        async with self.uow as uow:
            student = await uow.users.get_student_profile_by_user_id(user_id)
            if not student:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profil mahasiswa tidak ditemukan.",
                )
            cv_url = await _resolve_url(uow, student.cv_id)
            photo_url = await _resolve_url(uow, student.photo_profile_id)

        return student, cv_url, photo_url

    async def update_profile(self, user_id: UUID, payload: dict):
        """
        Partial update: accepts a dict of only the fields the client sent
        (exclude_unset=True from Pydantic), applies them to UserORM + StudentORM,
        commits, and returns the updated Student domain entity + resolved URLs.
        """
        async with self.uow as uow:
            # Validate cv_id if provided
            if "cv_id" in payload and payload["cv_id"] is not None:
                doc = await uow.documents.get_by_id(payload["cv_id"])
                if not doc:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Dokumen CV tidak ditemukan. Upload terlebih dahulu.",
                    )

            # Validate photo_profile_id if provided
            if "photo_profile_id" in payload and payload["photo_profile_id"] is not None:
                doc = await uow.documents.get_by_id(payload["photo_profile_id"])
                if not doc:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Dokumen foto profil tidak ditemukan. Upload terlebih dahulu.",
                    )

            updated = await uow.users.update_student_profile(user_id=user_id, data=payload)
            if not updated:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profil mahasiswa tidak ditemukan.",
                )
            await uow.commit()

            cv_url = await _resolve_url(uow, updated.cv_id)
            photo_url = await _resolve_url(uow, updated.photo_profile_id)

        return updated, cv_url, photo_url
