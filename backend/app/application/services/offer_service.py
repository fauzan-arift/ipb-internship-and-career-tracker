"""
Offer Service — Phase 3 & 4
Handles creating job offers for accepted applicants,
and the student's respond (accept / reject) flow.
"""
import logging
from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import HTTPException

from app.domain.entities.offer import Offer
from app.domain.entities.application import ApplicationStatusHistory
from app.domain.entities.enums import ApplicationStatus, OfferStatus
from app.domain.unit_of_work import IUnitOfWork
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
            # Resolve HR's company
            hr = await uow.users.get_hr_by_user_id(hr_user_id)
            if not hr:
                raise HTTPException(status_code=404, detail="Profil HR tidak ditemukan.")
            company = await uow.companies.get_by_hr_id(hr.profile_id)
            if not company:
                raise HTTPException(status_code=404, detail="Perusahaan HR tidak ditemukan.")

            # Validate application exists
            app = await uow.applications.get_by_id(application_id)
            if not app:
                raise HTTPException(status_code=404, detail="Lamaran tidak ditemukan.")

            # Validate ownership
            internship = await uow.internships.get_by_id(app.internship_id)
            if not internship or internship.company_id != company.id:
                raise HTTPException(
                    status_code=403,
                    detail="Anda tidak memiliki akses ke lamaran ini.",
                )

            # Prevent duplicate offers
            existing_offer = await uow.offers.get_by_application_id(application_id)
            if existing_offer:
                raise HTTPException(
                    status_code=409,
                    detail="Penawaran untuk lamaran ini sudah ada.",
                )

            # Check if quota is full
            accepted_count = await uow.applications.count_accepted_by_internship(internship.id)
            if accepted_count >= internship.quota:
                raise HTTPException(
                    status_code=400,
                    detail="Kuota magang sudah terpenuhi, tidak bisa memberikan penawaran lagi."
                )

            # Validate offering file document exists
            doc = await uow.documents.get_by_id(payload.offering_file_id)
            if not doc:
                raise HTTPException(
                    status_code=404,
                    detail="Dokumen penawaran tidak ditemukan.",
                )

            # Create the offer
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

            # Side effect 1: Update application status to "Ditawarkan"
            old_status = app.status.value
            updated_app = app.model_copy(
                update={"status": ApplicationStatus.DITAWARKAN}
            )
            await uow.applications.save(updated_app)

            # Side effect 2: Record status history
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

    # ─────────────────────────────────────────────────────────────
    # Student-facing
    # ─────────────────────────────────────────────────────────────

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
            # Resolve student profile (students.id = FK in applications)
            student = await uow.users.get_student_profile_by_user_id(student_user_id)
            if not student:
                raise HTTPException(status_code=404, detail="Profil mahasiswa tidak ditemukan.")

            # Auto-expire pending offers
            pending_offers = await uow.offers.list_by_student_id(
                student_id=student.profile_id,
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

            offers = await uow.offers.list_by_student_id(
                student_id=student.profile_id,
                status_filter=status_filter,
            )

            items = []
            for offer in offers:
                # Resolve the offering letter URL
                file_url = None
                doc = await uow.documents.get_by_id(offer.offering_file_id)
                if doc:
                    file_url = doc.file_url

                # Resolve internship + company info
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
            # 1. Fetch the offer
            offer = await uow.offers.get_by_id(offer_id)
            if not offer:
                raise HTTPException(status_code=404, detail="Penawaran tidak ditemukan.")

            # 2. Ownership check
            student = await uow.users.get_student_profile_by_user_id(student_user_id)
            if not student:
                raise HTTPException(status_code=404, detail="Profil mahasiswa tidak ditemukan.")

            app = await uow.applications.get_by_id(offer.application_id)
            if not app or app.student_id != student.profile_id:
                raise HTTPException(
                    status_code=403,
                    detail="Anda tidak memiliki akses ke penawaran ini.",
                )

            # 3. Expiry check
            if date.today() > offer.expiry_date:
                raise HTTPException(status_code=400, detail="Penawaran telah kedaluwarsa.")

            # 4. State guard — only Pending offers can be responded to
            if offer.status != OfferStatus.PENDING.value:
                raise HTTPException(
                    status_code=409,
                    detail=f"Penawaran sudah dalam status '{offer.status}' dan tidak dapat diubah.",
                )

            # ── Atomic side-effects ──────────────────────────────

            # A. Update offer status
            new_offer_status = payload.response_status  # "Accepted" or "Rejected"
            updated_offer = offer.model_copy(update={"status": new_offer_status})
            saved_offer = await uow.offers.save(updated_offer)

            # B. Update application status to match the decision
            old_app_status = app.status.value
            new_app_status = (
                ApplicationStatus.DITERIMA
                if new_offer_status == OfferStatus.ACCEPTED.value
                else ApplicationStatus.DITOLAK
            )
            updated_app = app.model_copy(update={"status": new_app_status})
            await uow.applications.save(updated_app)

            # C. Record the status change in history
            history = ApplicationStatusHistory(
                application_id=app.id,
                previous_status=old_app_status,
                new_status=new_app_status.value,
            )
            await uow.applications.save_status_history(history)

            # Resolve file URL BEFORE commit so all reads stay in one phase.
            # Doing it after commit (but still inside the `async with` block) risks
            # triggering __aexit__ rollback on an already-committed transaction if
            # this query raises an exception.
            file_url = None
            doc = await uow.documents.get_by_id(saved_offer.offering_file_id)
            if doc:
                file_url = doc.file_url

            # Single commit — if any step above raised, the transaction rolls back
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
