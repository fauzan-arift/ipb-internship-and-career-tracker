from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.offer import Offer
from app.domain.repositories.offer_repository import IOfferRepository
from app.infrastructure.models.offer import OfferORM
from app.infrastructure.models.application import ApplicationORM


class SQLAlchemyOfferRepository(IOfferRepository):

    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_domain(self, orm: OfferORM) -> Offer:
        return Offer(
            id=orm.id,
            application_id=orm.application_id,
            offer_date=orm.offer_date,
            expiry_date=orm.expiry_date,
            status=orm.status,
            offer_detail=orm.offer_detail,
            compensation=orm.compensation,
            duration=orm.duration,
            offering_file_id=orm.offering_file_id,
            created_at=orm.created_at,
            updated_at=orm.updated_at,
        )

    async def get_by_id(self, offer_id: UUID) -> Optional[Offer]:
        r = await self._session.execute(
            select(OfferORM).where(OfferORM.id == offer_id)
        )
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

    async def get_by_application_id(self, application_id: UUID) -> Optional[Offer]:
        r = await self._session.execute(
            select(OfferORM).where(OfferORM.application_id == application_id)
        )
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

    async def list_by_student_id(
        self,
        student_id: UUID,
        status_filter: Optional[str] = None,
    ) -> List[Offer]:
        """Return all offers whose parent application belongs to `student_id`."""
        query = (
            select(OfferORM)
            .join(ApplicationORM, OfferORM.application_id == ApplicationORM.id)
            .where(ApplicationORM.student_id == student_id)
        )
        if status_filter:
            query = query.where(OfferORM.status == status_filter)
        query = query.order_by(OfferORM.created_at.desc())
        r = await self._session.execute(query)
        return [self._to_domain(o) for o in r.scalars().all()]

    async def save(self, offer: Offer) -> Offer:
        existing = None
        if offer.id:
            r = await self._session.execute(
                select(OfferORM).where(OfferORM.id == offer.id)
            )
            existing = r.scalars().first()

        if existing:
            existing.offer_date = offer.offer_date
            existing.expiry_date = offer.expiry_date
            existing.status = offer.status
            existing.offer_detail = offer.offer_detail
            existing.compensation = offer.compensation
            existing.duration = offer.duration
            existing.offering_file_id = offer.offering_file_id
            orm = existing
        else:
            orm = OfferORM(
                application_id=offer.application_id,
                offer_date=offer.offer_date,
                expiry_date=offer.expiry_date,
                status=offer.status,
                offer_detail=offer.offer_detail,
                compensation=offer.compensation,
                duration=offer.duration,
                offering_file_id=offer.offering_file_id,
            )
            self._session.add(orm)

        await self._session.flush()
        await self._session.refresh(orm)
        return self._to_domain(orm)
