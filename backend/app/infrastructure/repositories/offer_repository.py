from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.offer import Offer
from app.domain.repositories.offer_repository import IOfferRepository
from app.infrastructure.models.offer import OfferORM


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

    async def get_by_application_id(self, application_id: UUID) -> Optional[Offer]:
        r = await self._session.execute(
            select(OfferORM).where(OfferORM.application_id == application_id)
        )
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

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
