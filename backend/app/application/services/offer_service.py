"""
Offer Service — Phase 3
Handles creating job offers for accepted applicants.
"""
import logging
from uuid import UUID

from fastapi import HTTPException

from app.domain.entities.offer import Offer
from app.domain.entities.application import ApplicationStatusHistory
from app.domain.entities.enums import ApplicationStatus
from app.domain.unit_of_work import IUnitOfWork
from app.presentation.schemas.offer import OfferCreateRequest, OfferResponse

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
