from datetime import date
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.internship import Internship
from app.domain.repositories.internship_repository import IInternshipRepository
from app.infrastructure.models.internship import InternshipORM


class SQLAlchemyInternshipRepository(IInternshipRepository):

    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_domain(self, orm: InternshipORM) -> Internship:
        return Internship(
            id=orm.id,
            company_id=orm.company_id,
            title=orm.title,
            description=orm.description,
            requirement=orm.requirement,
            benefit=orm.benefit,
            location=orm.location,
            industry=orm.industry,
            quota=orm.quota,
            work_status=orm.work_status,
            payment_status=orm.payment_status,
            open_date=orm.open_date,
            close_date=orm.close_date,
            start_date=orm.start_date,
            end_date=orm.end_date,
            is_active=orm.is_active,
            created_at=orm.created_at,
            updated_at=orm.updated_at,
        )

    async def get_by_id(self, id: UUID) -> Optional[Internship]:
        r = await self._session.execute(
            select(InternshipORM).where(InternshipORM.id == id)
        )
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

    async def get_active_list(
        self,
        page: int,
        limit: int,
        search: Optional[str],
    ) -> Tuple[List[Internship], int]:
        today = date.today()
        base_where = [
            InternshipORM.is_active == True,  # noqa: E712
            or_(
                InternshipORM.close_date >= today,
                InternshipORM.close_date.is_(None),
            ),
        ]
        if search:
            from app.infrastructure.models.company import CompanyORM
            pattern = f"%{search}%"
            base_where.append(
                or_(
                    InternshipORM.title.ilike(pattern),
                    InternshipORM.description.ilike(pattern),
                    InternshipORM.location.ilike(pattern),
                    CompanyORM.company_name.ilike(pattern),
                )
            )

            total_stmt = (
                select(func.count())
                .select_from(InternshipORM)
                .join(CompanyORM, InternshipORM.company_id == CompanyORM.id)
                .where(*base_where)
            )
            stmt = (
                select(InternshipORM)
                .join(CompanyORM, InternshipORM.company_id == CompanyORM.id)
                .where(*base_where)
                .order_by(InternshipORM.open_date.desc())
                .offset((page - 1) * limit)
                .limit(limit)
            )
        else:
            total_stmt = select(func.count()).select_from(InternshipORM).where(*base_where)
            stmt = (
                select(InternshipORM)
                .where(*base_where)
                .order_by(InternshipORM.open_date.desc())
                .offset((page - 1) * limit)
                .limit(limit)
            )

        total_result = await self._session.execute(total_stmt)
        total = total_result.scalar_one()

        result = await self._session.execute(stmt)
        rows = result.scalars().all()
        return [self._to_domain(r) for r in rows], total

    async def get_by_company(
        self,
        company_id: UUID,
        page: int,
        limit: int,
        search: Optional[str],
    ) -> Tuple[List[Internship], int]:
        base_where = [InternshipORM.company_id == company_id]
        if search:
            pattern = f"%{search}%"
            base_where.append(
                or_(
                    InternshipORM.title.ilike(pattern),
                    InternshipORM.description.ilike(pattern),
                )
            )

        total_stmt = select(func.count()).select_from(InternshipORM).where(*base_where)
        total_result = await self._session.execute(total_stmt)
        total = total_result.scalar_one()

        stmt = (
            select(InternshipORM)
            .where(*base_where)
            .order_by(InternshipORM.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
        )
        result = await self._session.execute(stmt)
        rows = result.scalars().all()
        return [self._to_domain(r) for r in rows], total

    async def save(self, internship: Internship) -> Internship:
        existing = None
        if internship.id:
            r = await self._session.execute(
                select(InternshipORM).where(InternshipORM.id == internship.id)
            )
            existing = r.scalars().first()

        if existing:
            existing.title = internship.title
            existing.description = internship.description
            existing.requirement = internship.requirement
            existing.benefit = internship.benefit
            existing.location = internship.location
            existing.industry = internship.industry
            existing.quota = internship.quota
            existing.work_status = internship.work_status
            existing.payment_status = internship.payment_status
            existing.open_date = internship.open_date
            existing.close_date = internship.close_date
            existing.start_date = internship.start_date
            existing.end_date = internship.end_date
            existing.is_active = internship.is_active
            orm = existing
        else:
            orm = InternshipORM(
                company_id=internship.company_id,
                title=internship.title,
                description=internship.description,
                requirement=internship.requirement,
                benefit=internship.benefit,
                location=internship.location,
                industry=internship.industry,
                quota=internship.quota,
                work_status=internship.work_status,
                payment_status=internship.payment_status,
                open_date=internship.open_date,
                close_date=internship.close_date,
                start_date=internship.start_date,
                end_date=internship.end_date,
                is_active=internship.is_active,
            )
            self._session.add(orm)

        await self._session.flush()
        await self._session.refresh(orm)
        return self._to_domain(orm)

    async def delete(self, id: UUID) -> None:
        r = await self._session.execute(
            select(InternshipORM).where(InternshipORM.id == id)
        )
        orm = r.scalars().first()
        if orm:
            await self._session.delete(orm)
            await self._session.flush()
