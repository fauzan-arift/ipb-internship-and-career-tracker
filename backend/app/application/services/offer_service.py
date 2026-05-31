import logging
from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select as _sa_select

from app.domain.entities.offer import Offer
from app.domain.entities.application import ApplicationStatusHistory
from app.domain.entities.enums import ApplicationStatus, OfferStatus
from app.domain.unit_of_work import IUnitOfWork
from app.infrastructure.models.student import StudentORM as _StudentORM
from app.infrastructure.models.application import ApplicationORM as _AppORM
from app.infrastructure.models.offer import OfferORM as _OfferORM
from app.infrastructure.models.internship import InternshipORM as _InternshipORM
from app.presentation.schemas.offer import (
    OfferCreateRequest,
    OfferResponse,
    OfferInternshipBrief,
    StudentOfferListItem,
    StudentOfferListResponse,
    OfferRespondRequest,
)

logger = logging.getLogger(__name__)


class OfferService:

    def __init__(self, uow: IUnitOfWork):
        self.uow = uow

    async def create_offer(
        self,
        hr_user_id: UUID,
        application_id: UUID,
        payload: OfferCreateRequest,
    ) -> OfferResponse:
        async with self.uow as uow:

            hr = await uow.users.get_hr_by_user_id(hr_user_id)
            if not hr:
                raise HTTPException(status_code=404, detail="Profil HR tidak ditemukan.")
            company = await uow.companies.get_by_hr_id(hr.profile_id)
            if not company:
                raise HTTPException(status_code=404, detail="Perusahaan HR tidak ditemukan.")


            app = await uow.applications.get_by_id(application_id)
            if not app:
                raise HTTPException(status_code=404, detail="Lamaran tidak ditemukan.")


            internship = await uow.internships.get_by_id(app.internship_id)
            if not internship or internship.company_id != company.id:
                raise HTTPException(
                    status_code=403,
                    detail="Anda tidak memiliki akses ke lamaran ini.",
                )


            existing_offer = await uow.offers.get_by_application_id(application_id)
            if existing_offer:
                raise HTTPException(
                    status_code=409,
                    detail="Penawaran untuk lamaran ini sudah ada.",
                )


            accepted_count = await uow.applications.count_accepted_by_internship(internship.id)
            if accepted_count >= internship.quota:
                raise HTTPException(
                    status_code=400,
                    detail="Kuota magang sudah terpenuhi, tidak bisa memberikan penawaran lagi."
                )


            doc = await uow.documents.get_by_id(payload.offering_file_id)
            if not doc:
                raise HTTPException(
                    status_code=404,
                    detail="Dokumen penawaran tidak ditemukan.",
                )


            offer = Offer(
                application_id=application_id,
                offer_date=payload.offer_date,
                expiry_date=payload.expiry_date,
                status="Pending",
                offer_detail=payload.offer_detail,
                compensation=payload.compensation,
                duration=payload.duration,
                offering_file_id=payload.offering_file_id,
            )
            saved_offer = await uow.offers.save(offer)


            old_status = app.status.value
            updated_app = app.model_copy(
                update={"status": ApplicationStatus.DITAWARKAN}
            )
            await uow.applications.save(updated_app)


            history = ApplicationStatusHistory(
                application_id=application_id,
                previous_status=old_status,
                new_status=ApplicationStatus.DITAWARKAN.value,
            )
            await uow.applications.save_status_history(history)

            await uow.commit()

        return OfferResponse(
            id=saved_offer.id,
            application_id=saved_offer.application_id,
            offer_date=saved_offer.offer_date,
            expiry_date=saved_offer.expiry_date,
            status=saved_offer.status,
            offer_detail=saved_offer.offer_detail,
            compensation=saved_offer.compensation,
            duration=saved_offer.duration,
            offering_file_id=saved_offer.offering_file_id,
            offering_file_url=doc.file_url,
        )



    async def get_student_offers(
        self,
        student_user_id: UUID,
        status_filter: Optional[str] = None,
    ) -> StudentOfferListResponse:
        """
        Fetch all offers received by the authenticated student.
        Each item is a richly-nested DTO containing offer details,
        the offering-letter file URL, and internship/company info.
        """
        async with self.uow as uow:

            student = await uow.users.get_student_profile_by_user_id(student_user_id)
            if not student:
                raise HTTPException(status_code=404, detail="Profil mahasiswa tidak ditemukan.")


            pending_offers = await uow.offers.list_by_student_id(
                student_id=student.profile_id,
                status_filter="Pending",
            )
            any_expired = False
            for offer in pending_offers:
                if date.today() > offer.expiry_date:

                    updated_offer = offer.model_copy(update={"status": "Rejected"})
                    await uow.offers.save(updated_offer)


                    app = await uow.applications.get_by_id(offer.application_id)
                    if app:
                        old_status = app.status.value
                        updated_app = app.model_copy(update={"status": ApplicationStatus.DITOLAK})
                        await uow.applications.save(updated_app)


                        history = ApplicationStatusHistory(
                            application_id=app.id,
                            previous_status=old_status,
                            new_status=ApplicationStatus.DITOLAK.value,
                        )
                        await uow.applications.save_status_history(history)
                    any_expired = True

            if any_expired:
                await uow.commit()

            offers = await uow.offers.list_by_student_id(
                student_id=student.profile_id,
                status_filter=status_filter,
            )

            items = []
            for offer in offers:

                file_url = None
                doc = await uow.documents.get_by_id(offer.offering_file_id)
                if doc:
                    file_url = doc.file_url


                app = await uow.applications.get_by_id(offer.application_id)
                internship_title = "Unknown"
                company_name = "Unknown"
                location = ""
                company_photo = None
                if app:
                    internship = await uow.internships.get_by_id(app.internship_id)
                    if internship:
                        internship_title = internship.title
                        location = internship.location
                        company = await uow.companies.get_by_id(internship.company_id)
                        if company:
                            company_name = company.company_name
                            if company.photo_profile_id:
                                doc_comp = await uow.documents.get_by_id(company.photo_profile_id)
                                if doc_comp:
                                    company_photo = doc_comp.file_url

                items.append(
                    StudentOfferListItem(
                        id=offer.id,
                        offer_date=offer.offer_date,
                        expiry_date=offer.expiry_date,
                        compensation=offer.compensation,
                        duration=offer.duration,
                        offer_detail=offer.offer_detail,
                        offering_file_url=file_url,
                        internship=OfferInternshipBrief(
                            title=internship_title,
                            company_name=company_name,
                            location=location,
                            photo_profile_url=company_photo,
                        ),
                        status=offer.status,
                    )
                )

        return StudentOfferListResponse(offers=items)

    async def respond_to_offer(
        self,
        student_user_id: UUID,
        offer_id: UUID,
        payload: OfferRespondRequest,
    ) -> OfferResponse:
        """
        Allow a student to Accept or Reject a pending offer.

        Validations (in order):
          1. Offer exists.
          2. The offer's parent application belongs to the authenticated student.
          3. Offer is not expired (expiry_date >= today).
          4. Offer is currently in 'Pending' state.

        Side-effects (all within one atomic transaction):
          A. Update Offer.status → Accepted | Rejected
          B. Update Application.status → Diterima | Ditolak
          C. Insert ApplicationStatusHistory record
        """
        async with self.uow as uow:

            offer = await uow.offers.get_by_id(offer_id)
            if not offer:
                raise HTTPException(status_code=404, detail="Penawaran tidak ditemukan.")


            student = await uow.users.get_student_profile_by_user_id(student_user_id)
            if not student:
                raise HTTPException(status_code=404, detail="Profil mahasiswa tidak ditemukan.")

            app = await uow.applications.get_by_id(offer.application_id)
            if not app or app.student_id != student.profile_id:
                raise HTTPException(
                    status_code=403,
                    detail="Anda tidak memiliki akses ke penawaran ini.",
                )


            if date.today() > offer.expiry_date:
                raise HTTPException(status_code=400, detail="Penawaran telah kedaluwarsa.")


            if offer.status != OfferStatus.PENDING.value:
                raise HTTPException(
                    status_code=409,
                    detail=f"Penawaran sudah dalam status '{offer.status}' dan tidak dapat diubah.",
                )


            new_offer_status = payload.response_status
            updated_offer = offer.model_copy(update={"status": new_offer_status})
            saved_offer = await uow.offers.save(updated_offer)


            old_app_status = app.status.value
            new_app_status = (
                ApplicationStatus.DITERIMA
                if new_offer_status == OfferStatus.ACCEPTED.value
                else ApplicationStatus.DITOLAK
            )
            updated_app = app.model_copy(update={"status": new_app_status})
            await uow.applications.save(updated_app)


            history = ApplicationStatusHistory(
                application_id=app.id,
                previous_status=old_app_status,
                new_status=new_app_status.value,
            )
            await uow.applications.save_status_history(history)

            # D. If student ACCEPTED — increment CareerMapping counter (same transaction)
            if new_offer_status == OfferStatus.ACCEPTED.value:
                try:

                    _student_r = await uow._session.execute(
                        _sa_select(_StudentORM).where(_StudentORM.id == app.student_id)
                    )
                    student_orm = _student_r.scalars().first()


                    internship = await uow.internships.get_by_id(app.internship_id)

                    if student_orm and internship and student_orm.faculty and student_orm.major:
                        company_id = internship.company_id

                        # ── Deduplication guard ──────────────────────────────────
                        # Check whether this student already has ANOTHER accepted
                        # offer at the SAME company (excluding the current application).
                        # If yes → they are already counted as 1 alumnus → skip.
                        prior_accepted_r = await uow._session.execute(
                            _sa_select(_AppORM.id)
                            .join(_OfferORM, _OfferORM.application_id == _AppORM.id)
                            .join(_InternshipORM, _InternshipORM.id == _AppORM.internship_id)
                            .where(
                                _AppORM.student_id == app.student_id,
                                _InternshipORM.company_id == company_id,
                                _OfferORM.status == OfferStatus.ACCEPTED.value,
                                _AppORM.id != app.id,
                            )
                            .limit(1)
                        )
                        already_counted = prior_accepted_r.scalars().first() is not None

                        if already_counted:
                            logger.info(
                                "CareerMapping skipped (student already counted): "
                                "student_id=%s company_id=%s",
                                app.student_id,
                                company_id,
                            )
                        else:
                            await uow.career_mappings.upsert_increment(
                                faculty=student_orm.faculty,
                                major=student_orm.major,
                                company_id=company_id,
                            )
                            logger.info(
                                "CareerMapping incremented: faculty=%s major=%s company_id=%s",
                                student_orm.faculty,
                                student_orm.major,
                                company_id,
                            )
                    else:
                        logger.warning(
                            "CareerMapping skipped: missing student faculty/major or internship "
                            "(student_id=%s, internship_id=%s)",
                            app.student_id,
                            app.internship_id,
                        )
                except Exception as cm_err:
                    logger.error("CareerMapping upsert failed: %s", cm_err, exc_info=True)
                    raise

            # Resolve file URL BEFORE commit so all reads stay in one phase.
            # Doing it after commit (but still inside the `async with` block) risks
            # triggering __aexit__ rollback on an already-committed transaction if
            # this query raises an exception.
            file_url = None
            doc = await uow.documents.get_by_id(saved_offer.offering_file_id)
            if doc:
                file_url = doc.file_url


            await uow.commit()

        return OfferResponse(
            id=saved_offer.id,
            application_id=saved_offer.application_id,
            offer_date=saved_offer.offer_date,
            expiry_date=saved_offer.expiry_date,
            status=saved_offer.status,
            offer_detail=saved_offer.offer_detail,
            compensation=saved_offer.compensation,
            duration=saved_offer.duration,
            offering_file_id=saved_offer.offering_file_id,
            offering_file_url=file_url,
        )
