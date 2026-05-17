"""
Application Service — Phase 3
Handles student and HR views of applications, status updates (with history), and offer creation.
"""
import logging
import math
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import HTTPException, status

from app.domain.entities.application import Application, ApplicationStatusHistory
from app.domain.entities.enums import ApplicationStatus
from app.domain.unit_of_work import IUnitOfWork
from app.application.services.email_service import EmailService
from app.presentation.schemas.application import (
    ApplicationStats,
    StudentApplicationListItem,
    StudentApplicationListResponse,
    StudentApplicationDetailResponse,
    InternshipBrief,
    CompanyBrief,
    OfferBrief,
    HRApplicantListItem,
    HRApplicantDetailResponse,
    PaginatedHRApplicantResponse,
    StudentBrief,
    StudentDetail,
    ApplicationStatusHistoryResponse,
    HRApplicantListItemWithInternship,
    PaginatedHRAllApplicantResponse,
)

logger = logging.getLogger(__name__)

# Statuses that count as "in processing" (everything that is not final)
_ACCEPTED_STATUSES = {ApplicationStatus.ACCEPTED.value, ApplicationStatus.DITERIMA.value}
_REJECTED_STATUSES = {ApplicationStatus.REJECTED.value, ApplicationStatus.DITOLAK.value}


class ApplicationService:

    def __init__(self, uow: IUnitOfWork, email_service: Optional[EmailService] = None):
        self.uow = uow
        self.email_service = email_service

    # ─────────────────────────────────────────────────────────────
    # Helpers
    # ─────────────────────────────────────────────────────────────

    async def _resolve_student_profile(self, uow, user_id: UUID):
        student = await uow.users.get_student_profile_by_user_id(user_id)
        if not student:
            raise HTTPException(status_code=404, detail="Profil mahasiswa tidak ditemukan.")
        return student

    async def _resolve_hr_company(self, uow, hr_user_id: UUID):
        hr = await uow.users.get_hr_by_user_id(hr_user_id)
        if not hr:
            raise HTTPException(status_code=404, detail="Profil HR tidak ditemukan.")
        company = await uow.companies.get_by_hr_id(hr.profile_id)
        if not company:
            raise HTTPException(status_code=404, detail="Perusahaan HR tidak ditemukan.")
        return company

    async def _build_internship_brief(self, uow, internship_id: UUID) -> InternshipBrief:
        internship = await uow.internships.get_by_id(internship_id)
        if not internship:
            return InternshipBrief(id=internship_id, title="Unknown")

        company_brief = None
        company = await uow.companies.get_by_id(internship.company_id)
        if company:
            photo_url = None
            if company.photo_profile_id:
                doc = await uow.documents.get_by_id(company.photo_profile_id)
                if doc:
                    photo_url = doc.file_url
            company_brief = CompanyBrief(
                company_name=company.company_name,
                photo_profile_url=photo_url,
            )

        return InternshipBrief(id=internship_id, title=internship.title, company=company_brief)

    async def _auto_expire_pending_offers(self, uow, student_id: UUID) -> None:
        from datetime import date
        pending_offers = await uow.offers.list_by_student_id(
            student_id=student_id,
            status_filter="Pending",
        )
        any_expired = False
        for offer in pending_offers:
            if date.today() > offer.expiry_date:
                # Update offer status to Rejected
                updated_offer = offer.model_copy(update={"status": "Rejected"})
                await uow.offers.save(updated_offer)

                # Update application status to Ditolak
                app = await uow.applications.get_by_id(offer.application_id)
                if app:
                    old_status = app.status.value
                    updated_app = app.model_copy(update={"status": ApplicationStatus.DITOLAK})
                    await uow.applications.save(updated_app)

                    # Write history
                    history = ApplicationStatusHistory(
                        application_id=app.id,
                        previous_status=old_status,
                        new_status=ApplicationStatus.DITOLAK.value,
                    )
                    await uow.applications.save_status_history(history)
                any_expired = True

        if any_expired:
            await uow.commit()

    # ─────────────────────────────────────────────────────────────
    # Student-facing
    # ─────────────────────────────────────────────────────────────

    async def get_student_applications(
        self, student_user_id: UUID
    ) -> StudentApplicationListResponse:
        async with self.uow as uow:
            student = await self._resolve_student_profile(uow, student_user_id)
            await self._auto_expire_pending_offers(uow, student.profile_id)
            # student.profile_id = students table PK, used as FK in applications
            apps = await uow.applications.list_by_student(student.profile_id)
            
            total = len(apps)
            accepted = sum(1 for a in apps if a.status.value in _ACCEPTED_STATUSES)
            rejected = sum(1 for a in apps if a.status.value in _REJECTED_STATUSES)
            processing = total - accepted - rejected

            items = []
            for app in apps:
                internship_brief = await self._build_internship_brief(uow, app.internship_id)
                items.append(
                    StudentApplicationListItem(
                        id=app.id,
                        internship=internship_brief,
                        status=app.status.value,
                        application_time=app.application_time,
                    )
                )

        return StudentApplicationListResponse(
            stats=ApplicationStats(
                total_applications=total,
                processing_count=processing,
                accepted_count=accepted,
                rejected_count=rejected,
            ),
            applications=items,
        )

    async def get_student_application_detail(
        self, student_user_id: UUID, application_id: UUID
    ) -> StudentApplicationDetailResponse:
        async with self.uow as uow:
            student = await self._resolve_student_profile(uow, student_user_id)
            await self._auto_expire_pending_offers(uow, student.profile_id)
            app = await uow.applications.get_by_id(application_id)

            if not app or app.student_id != student.profile_id:
                raise HTTPException(status_code=404, detail="Lamaran tidak ditemukan.")

            internship_brief = await self._build_internship_brief(uow, app.internship_id)
            history_list = await uow.applications.get_status_history(application_id)
            history_resp = [
                ApplicationStatusHistoryResponse(
                    id=h.id,
                    previous_status=h.previous_status,
                    new_status=h.new_status,
                    changed_at=h.changed_at,
                )
                for h in history_list
            ]

            offer_brief = None
            offer = await uow.offers.get_by_application_id(application_id)
            if offer:
                file_url = None
                doc = await uow.documents.get_by_id(offer.offering_file_id)
                if doc:
                    file_url = doc.file_url
                offer_brief = OfferBrief(
                    id=offer.id,
                    offer_date=offer.offer_date,
                    expiry_date=offer.expiry_date,
                    status=offer.status,
                    offer_detail=offer.offer_detail,
                    compensation=offer.compensation,
                    duration=offer.duration,
                    offering_file_url=file_url,
                )

        return StudentApplicationDetailResponse(
            id=app.id,
            internship=internship_brief,
            status=app.status.value,
            application_time=app.application_time,
            status_history=history_resp,
            offer=offer_brief,
        )

    # ─────────────────────────────────────────────────────────────
    # HR-facing
    # ─────────────────────────────────────────────────────────────

    async def list_hr_applicants(
        self,
        hr_user_id: UUID,
        internship_id: UUID,
        status_filter: Optional[str],
        page: int,
        limit: int,
    ) -> PaginatedHRApplicantResponse:
        async with self.uow as uow:
            company = await self._resolve_hr_company(uow, hr_user_id)

            # Ownership check
            internship = await uow.internships.get_by_id(internship_id)
            if not internship or internship.company_id != company.id:
                raise HTTPException(
                    status_code=403,
                    detail="Anda tidak memiliki akses ke lowongan ini.",
                )

            apps, total = await uow.applications.list_by_internship(
                internship_id=internship_id,
                status_filter=status_filter,
                page=page,
                limit=limit,
            )

            items = []
            for app in apps:
                student_profile = await uow.users.get_student_profile_by_id(app.student_id)
                user_orm = None
                if student_profile:
                    # student_profile.id == user_orm.id (set by _student_to_domain mapper)
                    user_orm = await uow.users.get_by_id(student_profile.id)

                full_name = user_orm.full_name if user_orm else "Unknown"
                nim = student_profile.nim if student_profile else ""
                major = student_profile.major if student_profile else ""

                items.append(
                    HRApplicantListItem(
                        id=app.id,
                        student=StudentBrief(
                            id=app.student_id,
                            full_name=full_name,
                            nim=nim,
                            major=major,
                            application_time=app.application_time,
                            status=app.status.value,
                        ),
                        application_time=app.application_time,
                        status=app.status.value,
                    )
                )

        return PaginatedHRApplicantResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            total_pages=math.ceil(total / limit) if limit else 0,
        )

    async def get_hr_applicant_detail(
        self,
        hr_user_id: UUID,
        application_id: UUID,
    ) -> HRApplicantDetailResponse:
        async with self.uow as uow:
            company = await self._resolve_hr_company(uow, hr_user_id)
            app = await uow.applications.get_by_id(application_id)

            if not app:
                raise HTTPException(status_code=404, detail="Lamaran tidak ditemukan.")

            # Ownership: verify internship belongs to company
            internship = await uow.internships.get_by_id(app.internship_id)
            if not internship or internship.company_id != company.id:
                raise HTTPException(
                    status_code=403,
                    detail="Anda tidak memiliki akses ke lamaran ini.",
                )

            # Build student detail
            student_profile = await uow.users.get_student_profile_by_id(app.student_id)
            if not student_profile:
                raise HTTPException(status_code=404, detail="Profil mahasiswa tidak ditemukan.")
            # student_profile.id == user_orm.id (set by _student_to_domain mapper)
            user_orm = await uow.users.get_by_id(student_profile.id)

            cv_url = None
            if student_profile.cv_id:
                doc = await uow.documents.get_by_id(student_profile.cv_id)
                if doc:
                    cv_url = doc.file_url

            photo_profile_url = None
            if getattr(student_profile, 'photo_profile_id', None):
                doc = await uow.documents.get_by_id(student_profile.photo_profile_id)
                if doc:
                    photo_profile_url = doc.file_url

            # student_profile.skills is already List[str] from the domain mapper
            skill_names = student_profile.skills if student_profile.skills else []

            history_list = await uow.applications.get_status_history(application_id)
            history_resp = [
                ApplicationStatusHistoryResponse(
                    id=h.id,
                    previous_status=h.previous_status,
                    new_status=h.new_status,
                    changed_at=h.changed_at,
                )
                for h in history_list
            ]

        return HRApplicantDetailResponse(
            id=app.id,
            status=app.status.value,
            application_time=app.application_time,
            position=internship.title,
            student=StudentDetail(
                id=student_profile.profile_id,  # students table PK
                full_name=user_orm.full_name if user_orm else "Unknown",
                nim=student_profile.nim,
                major=student_profile.major,
                faculty=student_profile.faculty,
                gpa=student_profile.gpa,
                phone_number=student_profile.phone_number,
                email=user_orm.email if user_orm else "",
                skills=skill_names,
                cv_url=cv_url,
                photo_profile_url=photo_profile_url,
            ),
            status_history=history_resp,
        )

    async def update_application_status(
        self,
        hr_user_id: UUID,
        application_id: UUID,
        new_status: str,
    ) -> None:
        # ── gather everything we need for email BEFORE closing the UoW ──
        student_user = None
        internship_title = ""
        company_name = ""

        async with self.uow as uow:
            company = await self._resolve_hr_company(uow, hr_user_id)
            app = await uow.applications.get_by_id(application_id)

            if not app:
                raise HTTPException(status_code=404, detail="Lamaran tidak ditemukan.")

            internship = await uow.internships.get_by_id(app.internship_id)
            if not internship or internship.company_id != company.id:
                raise HTTPException(
                    status_code=403,
                    detail="Anda tidak memiliki akses ke lamaran ini.",
                )

            old_status = app.status.value

            # Validate new status value (Case-Insensitive)
            try:
                target = new_status.strip().lower()
                updated_status = next(
                    (s for s in ApplicationStatus if s.value.lower() == target),
                    None
                )
                if not updated_status:
                    raise ValueError()
            except ValueError:
                raise HTTPException(
                    status_code=422,
                    detail=f"Status '{new_status}' tidak valid.",
                )

            updated_app = app.model_copy(update={"status": updated_status})
            await uow.applications.save(updated_app)

            # CRITICAL: Record status history
            history = ApplicationStatusHistory(
                application_id=app.id,
                previous_status=old_status,
                new_status=new_status,
            )
            await uow.applications.save_status_history(history)
            await uow.commit()

            # Collect email data while session is still open
            internship_title = internship.title
            company_name = company.company_name
            student_profile = await uow.users.get_student_profile_by_id(app.student_id)
            if student_profile:
                # student_profile.id == user_orm.id (set by _student_to_domain mapper)
                student_user = await uow.users.get_by_id(student_profile.id)

        # ── send email AFTER commit (non-blocking, never fails the request) ──
        if self.email_service and student_user:
            try:
                await self.email_service.send_application_status_update(
                    student_user=student_user,
                    internship_title=internship_title,
                    company_name=company_name,
                    new_status=new_status,
                    application_id=str(application_id),
                    uow=self.uow,
                )
            except Exception as exc:
                logger.error(
                    "Gagal mengirim email notifikasi status lamaran %s: %s",
                    application_id, exc
                )

    async def list_all_hr_applicants(
        self,
        hr_user_id: UUID,
        status_filter: Optional[str],
        page: int,
        limit: int,
    ) -> PaginatedHRAllApplicantResponse:
        """
        Return ALL applicants across every internship posted by the HR's company.

        Strategy:
          1. Fetch all company internships (single bulk query, no pagination).
          2. For each internship, query its applications (with optional status filter).
          3. Collect all results, sort by application_time desc, then paginate in Python.

        This avoids N+1 at the HTTP level while keeping the existing repository
        interfaces unchanged.
        """
        async with self.uow as uow:
            company = await self._resolve_hr_company(uow, hr_user_id)

            # Get ALL internships for this company (use a large limit; companies
            # realistically have far fewer than 10 000 postings)
            all_internships, _ = await uow.internships.get_by_company(
                company_id=company.id,
                page=1,
                limit=10_000,
                search=None,
            )

            # Collect raw applications enriched with internship title
            raw: list[tuple] = []  # (application, internship_title)
            for internship in all_internships:
                apps, _ = await uow.applications.list_by_internship(
                    internship_id=internship.id,
                    status_filter=status_filter,
                    page=1,
                    limit=10_000,
                )
                for app in apps:
                    raw.append((app, internship.title, internship.id))

            # Sort by application_time descending (newest first)
            _epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
            raw.sort(
                key=lambda t: t[0].application_time or _epoch,
                reverse=True,
            )

            total = len(raw)
            total_pages = math.ceil(total / limit) if limit else 0

            # Paginate in Python
            start = (page - 1) * limit
            page_slice = raw[start: start + limit]

            items = []
            for app, internship_title, internship_id in page_slice:
                student_profile = await uow.users.get_student_profile_by_id(app.student_id)

                # full_name is already resolved in _student_to_domain via the user JOIN —
                # no need for a separate get_by_id(users) call (avoids N+1).
                full_name = student_profile.full_name if student_profile else "Unknown"
                nim = student_profile.nim if student_profile else ""
                major = student_profile.major if student_profile else ""

                items.append(
                    HRApplicantListItemWithInternship(
                        id=app.id,
                        internship_id=internship_id,
                        internship_title=internship_title,
                        student=StudentBrief(
                            id=app.student_id,
                            full_name=full_name,
                            nim=nim,
                            major=major,
                            application_time=app.application_time,
                            status=app.status.value,
                        ),
                        application_time=app.application_time,
                        status=app.status.value,
                    )
                )

        return PaginatedHRAllApplicantResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
        )
