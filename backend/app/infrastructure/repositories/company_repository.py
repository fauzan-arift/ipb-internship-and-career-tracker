"""
Infrastructure — SQLAlchemy implementation of ICompanyRepository.
"""
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.company import Company
from app.domain.repositories.company_repository import ICompanyRepository
from app.infrastructure.models.company import CompanyORM


class SQLAlchemyCompanyRepository(ICompanyRepository):

    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_domain(self, orm: CompanyORM) -> Company:
        return Company(
            id=orm.id,
            hr_id=orm.hr_id,
            company_name=orm.company_name,
            address=orm.address,
            industry=orm.industry,
            website=orm.website,
            description=orm.description,
            email=orm.email,
            npwp_document_id=orm.npwp_document_id,
            verification_status=orm.verification_status,
            verified_at=orm.verified_at,
            registration_date=orm.registration_date,
            created_at=orm.created_at,
            updated_at=orm.updated_at,
        )

    async def get_by_id(self, id: UUID) -> Optional[Company]:
        r = await self._session.execute(select(CompanyORM).where(CompanyORM.id == id))
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

    async def get_by_hr_id(self, hr_id: UUID) -> Optional[Company]:
        r = await self._session.execute(select(CompanyORM).where(CompanyORM.hr_id == hr_id))
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

    async def save(self, company: Company) -> Company:
        existing = None
        if company.id:
            r = await self._session.execute(select(CompanyORM).where(CompanyORM.id == company.id))
            existing = r.scalars().first()

        if existing:
            existing.company_name = company.company_name
            existing.address = company.address
            existing.industry = company.industry
            existing.website = company.website
            existing.description = company.description
            existing.email = company.email
            existing.npwp_document_id = company.npwp_document_id
            existing.verification_status = company.verification_status
            existing.verified_at = company.verified_at
            orm = existing
        else:
            orm = CompanyORM(
                hr_id=company.hr_id,
                company_name=company.company_name,
                address=company.address,
                industry=company.industry,
                website=company.website,
                description=company.description,
                email=company.email,
                npwp_document_id=company.npwp_document_id,
                verification_status=company.verification_status,
                verified_at=company.verified_at,
            )
            self._session.add(orm)

        await self._session.flush()
        return company.model_copy(update={"id": orm.id})
