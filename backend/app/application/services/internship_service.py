import logging
import math
from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import HTTPException, status

from app.domain.entities.internship import Internship
from app.domain.entities.application import Application, ApplicationStatusHistory
from app.domain.entities.enums import ApplicationStatus
from app.domain.unit_of_work import IUnitOfWork
from app.presentation.schemas.internship import (
    InternshipCreateRequest,
    InternshipUpdateRequest,
    InternshipReopenRequest,
    InternshipListItem,
    InternshipDetailResponse,
    PaginatedInternshipResponse,
    CompanySummary,
)
from app.presentation.schemas.application import ApplicationResponse

logger = logging.getLogger(__name__)


class InternshipService:

    def __init__(self, uow: IUnitOfWork):
        self.uow = uow

    # ==================== Helpers ====================

    async def _build_company_summary(self, uow, company_id: UUID) -> Optional[CompanySummary]:
        company = await uow.companies.get_by_id(company_id)
        if not company:
            return None
        return CompanySummary(
            id=company.id,
            company_name=company.company_name,
            industry=company.industry,
            address=company.address,
            website=company.website,
        )

    # ==================== Student-facing ====================

    async def list_active_internships(
        self,
        page: int,
        limit: int,
        search: Optional[str],
    ) -> PaginatedInternshipResponse:
        async with self.uow as uow:
            items, total = await uow.internships.get_active_list(page, limit, search)
            result_items = []
            for internship in items:
                company_summary = await self._build_company_summary(uow, internship.company_id)
                result_items.append(
                    InternshipListItem(
                        **internship.model_dump(exclude={"created_at", "updated_at", "description", "requirement", "benefit"}),
                        company=company_summary,
                    )
                )

        return PaginatedInternshipResponse(
            items=result_items,
            total=total,
            page=page,
            limit=limit,
            total_pages=math.ceil(total / limit) if limit else 0,
        )

    async def get_internship_detail(self, internship_id: UUID) -> InternshipDetailResponse:
        async with self.uow as uow:
            internship = await uow.internships.get_by_id(internship_id)
            if not internship:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Lowongan tidak ditemukan.",
                )
            company_summary = await self._build_company_summary(uow, internship.company_id)

        return InternshipDetailResponse(**internship.model_dump(exclude={"company_id"}), company=company_summary)

    async def apply_to_internship(
        self,
        internship_id: UUID,
        student_profile_id: UUID,
        submitted_cv_id: UUID,
    ) -> ApplicationResponse:
        async with self.uow as uow:
            internship = await uow.internships.get_by_id(internship_id)
            if not internship or not internship.is_active:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Lowongan tidak ditemukan atau sudah tidak aktif.",
                )
            if internship.close_date and internship.close_date < date.today():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Lowongan sudah melewati batas pendaftaran.",
                )

            # Check duplicate application
            existing = await uow.applications.get_by_student_and_internship(
                student_profile_id, internship_id
            )
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Kamu sudah mendaftar ke lowongan ini.",
                )

            # Validate the CV document belongs to the student
            cv_doc = await uow.documents.get_by_id(submitted_cv_id)
            if not cv_doc:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Dokumen CV tidak ditemukan.",
                )

            application = Application(
                student_id=student_profile_id,
                internship_id=internship_id,
                submitted_cv_id=submitted_cv_id,
                status=ApplicationStatus.PENDING,
            )
            saved_app = await uow.applications.save(application)

            # Auto-create initial status history
            history = ApplicationStatusHistory(
                application_id=saved_app.id,
                previous_status=None,
                new_status=ApplicationStatus.PENDING.value,
            )
            await uow.applications.save_status_history(history)

            await uow.commit()

        return ApplicationResponse(
            id=saved_app.id,
            student_id=saved_app.student_id,
            internship_id=saved_app.internship_id,
            submitted_cv_id=saved_app.submitted_cv_id,
            status=saved_app.status,
            application_time=saved_app.application_time,
        )

    # ==================== HR-facing ====================

    async def list_hr_internships(
        self,
        company_id: UUID,
        page: int,
        limit: int,
        search: Optional[str],
    ) -> PaginatedInternshipResponse:
        async with self.uow as uow:
            items, total = await uow.internships.get_by_company(company_id, page, limit, search)
            company_summary = await self._build_company_summary(uow, company_id)
            result_items = [
                InternshipListItem(
                    **i.model_dump(exclude={"created_at", "updated_at", "description", "requirement", "benefit"}),
                    company=company_summary,
                )
                for i in items
            ]

        return PaginatedInternshipResponse(
            items=result_items,
            total=total,
            page=page,
            limit=limit,
            total_pages=math.ceil(total / limit) if limit else 0,
        )

    async def create_internship(
        self,
        company_id: UUID,
        payload: InternshipCreateRequest,
    ) -> InternshipDetailResponse:
        async with self.uow as uow:
            internship = Internship(
                company_id=company_id,
                title=payload.title,
                description=payload.description,
                requirement=payload.requirement,
                benefit=payload.benefit,
                location=payload.location,
                industry=payload.industry,
                quota=payload.quota,
                work_status=payload.work_status,
                payment_status=payload.payment_status,
                open_date=payload.open_date or date.today(),
                close_date=payload.close_date,
                start_date=payload.start_date,
                end_date=payload.end_date,
                is_active=True,
            )
            saved = await uow.internships.save(internship)
            await uow.commit()
            company_summary = await self._build_company_summary(uow, company_id)

        return InternshipDetailResponse(**saved.model_dump(exclude={"company_id"}), company=company_summary)

    async def update_internship(
        self,
        internship_id: UUID,
        company_id: UUID,
        payload: InternshipUpdateRequest,
    ) -> InternshipDetailResponse:
        async with self.uow as uow:
            internship = await uow.internships.get_by_id(internship_id)
            if not internship:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Lowongan tidak ditemukan.",
                )
            if internship.company_id != company_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Anda tidak memiliki akses ke lowongan ini.",
                )

            update_data = payload.model_dump(exclude_unset=True)
            updated = internship.model_copy(update=update_data)
            saved = await uow.internships.save(updated)
            await uow.commit()
            company_summary = await self._build_company_summary(uow, company_id)

        return InternshipDetailResponse(**saved.model_dump(exclude={"company_id"}), company=company_summary)

    async def close_internship(
        self,
        internship_id: UUID,
        company_id: UUID,
    ) -> InternshipDetailResponse:
        async with self.uow as uow:
            internship = await uow.internships.get_by_id(internship_id)
            if not internship:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Lowongan tidak ditemukan.",
                )
            if internship.company_id != company_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Anda tidak memiliki akses ke lowongan ini.",
                )

            closed = internship.model_copy(update={"is_active": False, "close_date": date.today()})
            saved = await uow.internships.save(closed)
            await uow.commit()
            company_summary = await self._build_company_summary(uow, company_id)

        return InternshipDetailResponse(**saved.model_dump(exclude={"company_id"}), company=company_summary)

    async def delete_internship(
        self,
        internship_id: UUID,
        company_id: UUID,
    ) -> None:
        async with self.uow as uow:
            internship = await uow.internships.get_by_id(internship_id)
            if not internship:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Lowongan tidak ditemukan.",
                )
            if internship.company_id != company_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Anda tidak memiliki akses ke lowongan ini.",
                )

            # Guard: refuse deletion if any applicants exist
            application_count = await uow.applications.count_by_internship(internship_id)
            if application_count > 0:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Tidak dapat menghapus lowongan karena sudah memiliki "
                        f"{application_count} lamaran terkait."
                    ),
                )

            await uow.internships.delete(internship_id)
            await uow.commit()

    async def reopen_internship(
        self,
        internship_id: UUID,
        company_id: UUID,
        payload: InternshipReopenRequest,
    ) -> InternshipDetailResponse:
        async with self.uow as uow:
            internship = await uow.internships.get_by_id(internship_id)
            if not internship:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Lowongan tidak ditemukan.",
                )
            if internship.company_id != company_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Anda tidak memiliki akses ke lowongan ini.",
                )
            if internship.is_active:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Lowongan sudah aktif, tidak perlu dibuka kembali.",
                )
            if internship.start_date and payload.close_date > internship.start_date:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"close_date ({payload.close_date}) tidak boleh melebihi "
                        f"start_date lowongan ({internship.start_date})."
                    ),
                )

            reopened = internship.model_copy(
                update={"is_active": True, "close_date": payload.close_date}
            )
            saved = await uow.internships.save(reopened)
            await uow.commit()
            company_summary = await self._build_company_summary(uow, company_id)

        return InternshipDetailResponse(**saved.model_dump(exclude={"company_id"}), company=company_summary)
