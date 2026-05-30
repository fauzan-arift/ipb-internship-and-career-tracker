"""
Infrastructure Repository — CareerMapping
Handles all SQLAlchemy reads and writes for the career_mappings table.
"""
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.career_mapping import CareerMapping
from app.infrastructure.models.career_mapping import CareerMappingORM


class SQLAlchemyCareerMappingRepository:

    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_domain(self, orm: CareerMappingORM) -> CareerMapping:
        return CareerMapping(
            id=orm.id,
            faculty=orm.faculty,
            major=orm.major,
            company_id=orm.company_id,
            total_alumni=orm.total_alumni,
            last_updated=orm.last_updated,
        )

    async def get_by_faculty_major_company(
        self,
        faculty: str,
        major: str,
        company_id: UUID,
    ) -> Optional[CareerMappingORM]:
        """Return the ORM row directly so the caller can mutate it in-session."""
        r = await self._session.execute(
            select(CareerMappingORM).where(
                CareerMappingORM.faculty == faculty,
                CareerMappingORM.major == major,
                CareerMappingORM.company_id == company_id,
            )
        )
        return r.scalars().first()

    async def list_by_faculty_major(
        self,
        faculty: str,
        major: str,
    ) -> List[CareerMappingORM]:
        """Return all ORM rows for a given faculty+major pair (eager-ish)."""
        r = await self._session.execute(
            select(CareerMappingORM).where(
                CareerMappingORM.faculty == faculty,
                CareerMappingORM.major == major,
            )
        )
        return r.scalars().all()

    async def upsert_increment(
        self,
        faculty: str,
        major: str,
        company_id: UUID,
    ) -> CareerMappingORM:
        """
        Atomically increment total_alumni for the given row.
        If the row doesn't exist, create it with total_alumni = 1.
        Returns the mutated (unflushed) ORM instance — the caller must flush/commit.
        """
        existing = await self.get_by_faculty_major_company(faculty, major, company_id)
        if existing:
            from sqlalchemy.sql import func as _func
            existing.total_alumni += 1
            existing.last_updated = _func.now()
            return existing
        else:
            new_row = CareerMappingORM(
                faculty=faculty,
                major=major,
                company_id=company_id,
                total_alumni=1,
            )
            self._session.add(new_row)
            return new_row
