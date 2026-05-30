"""
Application Service — CareerMappingService
Fetches and aggregates career mapping data for the authenticated student's major.
"""
import logging
from uuid import UUID

from fastapi import HTTPException

from app.domain.unit_of_work import IUnitOfWork
from app.presentation.schemas.career_mapping import (
    CareerMappingResponse,
    CompanyDistributionItem,
)

logger = logging.getLogger(__name__)


class CareerMappingService:

    def __init__(self, uow: IUnitOfWork):
        self.uow = uow

    async def get_career_mapping(self, student_user_id: UUID) -> CareerMappingResponse:
        """
        Return the career mapping overview for the faculty+major of the
        authenticated student.

        Steps:
        1. Resolve the student's faculty and major.
        2. Fetch all CareerMapping rows matching that faculty+major.
        3. For each row, hydrate company name, industry, and logo URL.
        4. Aggregate grand_total and most-recent last_updated.
        """
        async with self.uow as uow:
            # 1. Resolve student profile
            student = await uow.users.get_student_profile_by_user_id(student_user_id)
            if not student:
                raise HTTPException(status_code=404, detail="Profil mahasiswa tidak ditemukan.")

            faculty = student.faculty
            major = student.major

            if not faculty or not major:
                raise HTTPException(
                    status_code=422,
                    detail="Profil mahasiswa belum memiliki data fakultas atau jurusan.",
                )

            # 2. Fetch all career mapping rows for this faculty+major
            rows = await uow.career_mappings.list_by_faculty_major(
                faculty=faculty,
                major=major,
            )

            # 3. Aggregate totals
            grand_total = sum(r.total_alumni for r in rows)
            last_updated = (
                max((r.last_updated for r in rows if r.last_updated), default=None)
                if rows
                else None
            )

            # 4. Build company distribution list
            distributions: list[CompanyDistributionItem] = []
            for row in sorted(rows, key=lambda r: r.total_alumni, reverse=True):
                company = await uow.companies.get_by_id(row.company_id)
                if not company:
                    logger.warning("CareerMapping row references missing company_id=%s", row.company_id)
                    continue

                # Resolve logo URL from document
                logo_url: str | None = None
                if company.photo_profile_id:
                    doc = await uow.documents.get_by_id(company.photo_profile_id)
                    if doc:
                        logo_url = doc.file_url

                distributions.append(
                    CompanyDistributionItem(
                        company_name=company.company_name,
                        industry=company.industry,
                        company_logo_url=logo_url,
                        total_alumni=row.total_alumni,
                    )
                )

            # Build response inside the block while all variables are guaranteed assigned
            return CareerMappingResponse(
                faculty=faculty,
                major=major,
                grand_total_students=grand_total,
                last_updated=last_updated,
                company_distributions=distributions,
            )
