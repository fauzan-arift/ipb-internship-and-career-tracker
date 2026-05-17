from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.application import Application, ApplicationStatusHistory
from app.domain.repositories.application_repository import IApplicationRepository
from app.infrastructure.models.application import ApplicationORM, ApplicationStatusHistoryORM


class SQLAlchemyApplicationRepository(IApplicationRepository):

    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_domain(self, orm: ApplicationORM) -> Application:
        return Application(
            id=orm.id,
            student_id=orm.student_id,
            internship_id=orm.internship_id,
            submitted_cv_id=orm.submitted_cv_id,
            status=orm.status,
            application_time=orm.application_time,
            created_at=orm.created_at,
        )

    def _history_to_domain(self, orm: ApplicationStatusHistoryORM) -> ApplicationStatusHistory:
        return ApplicationStatusHistory(
            id=orm.id,
            application_id=orm.application_id,
            previous_status=orm.previous_status,
            new_status=orm.new_status,
            changed_at=orm.changed_at,
        )

    async def get_by_id(self, id: UUID) -> Optional[Application]:
        r = await self._session.execute(
            select(ApplicationORM).where(ApplicationORM.id == id)
        )
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

    async def get_by_student_and_internship(
        self, student_id: UUID, internship_id: UUID
    ) -> Optional[Application]:
        r = await self._session.execute(
            select(ApplicationORM).where(
                ApplicationORM.student_id == student_id,
                ApplicationORM.internship_id == internship_id,
            )
        )
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

    async def list_by_student(self, student_id: UUID) -> List[Application]:
        r = await self._session.execute(
            select(ApplicationORM)
            .where(ApplicationORM.student_id == student_id)
            .order_by(ApplicationORM.application_time.desc())
        )
        return [self._to_domain(o) for o in r.scalars().all()]

    async def list_by_internship(
        self,
        internship_id: UUID,
        status_filter: Optional[str],
        page: int,
        limit: int,
    ) -> Tuple[List[Application], int]:
        from app.domain.entities.enums import ApplicationStatus  # local import to avoid circular

        query = select(ApplicationORM).where(
            ApplicationORM.internship_id == internship_id
        )
        if status_filter:
            try:
                enum_val = ApplicationStatus(status_filter)
                query = query.where(ApplicationORM.status == enum_val)
            except ValueError:
                # Unknown status value — return empty result set
                return [], 0

        count_q = select(func.count()).select_from(query.subquery())
        total = (await self._session.execute(count_q)).scalar_one()

        query = query.order_by(ApplicationORM.application_time.desc())
        query = query.offset((page - 1) * limit).limit(limit)
        items = (await self._session.execute(query)).scalars().all()

        return [self._to_domain(o) for o in items], total

    async def get_status_history(
        self, application_id: UUID
    ) -> List[ApplicationStatusHistory]:
        r = await self._session.execute(
            select(ApplicationStatusHistoryORM)
            .where(ApplicationStatusHistoryORM.application_id == application_id)
            .order_by(ApplicationStatusHistoryORM.changed_at.desc())
        )
        return [self._history_to_domain(o) for o in r.scalars().all()]

    async def count_by_internship(self, internship_id: UUID) -> int:
        r = await self._session.execute(
            select(func.count())
            .select_from(ApplicationORM)
            .where(ApplicationORM.internship_id == internship_id)
        )
        return r.scalar_one()

    async def count_accepted_by_internship(self, internship_id: UUID) -> int:
        from app.domain.entities.enums import ApplicationStatus
        r = await self._session.execute(
            select(func.count())
            .select_from(ApplicationORM)
            .where(
                ApplicationORM.internship_id == internship_id,
                ApplicationORM.status.in_([ApplicationStatus.ACCEPTED, ApplicationStatus.DITERIMA])
            )
        )
        return r.scalar_one()

    async def count_accepted_by_internship_ids(self, internship_ids: List[UUID]) -> dict[UUID, int]:
        if not internship_ids:
            return {}
            
        from app.domain.entities.enums import ApplicationStatus
        r = await self._session.execute(
            select(ApplicationORM.internship_id, func.count())
            .select_from(ApplicationORM)
            .where(
                ApplicationORM.internship_id.in_(internship_ids),
                ApplicationORM.status.in_([ApplicationStatus.ACCEPTED, ApplicationStatus.DITERIMA])
            )
            .group_by(ApplicationORM.internship_id)
        )
        return {row[0]: row[1] for row in r.all()}

    async def save(self, application: Application) -> Application:
        existing = None
        if application.id:
            r = await self._session.execute(
                select(ApplicationORM).where(ApplicationORM.id == application.id)
            )
            existing = r.scalars().first()

        if existing:
            existing.status = application.status
            orm = existing
        else:
            orm = ApplicationORM(
                student_id=application.student_id,
                internship_id=application.internship_id,
                submitted_cv_id=application.submitted_cv_id,
                status=application.status,
            )
            self._session.add(orm)

        await self._session.flush()
        await self._session.refresh(orm)
        return self._to_domain(orm)

    async def save_status_history(
        self, history: ApplicationStatusHistory
    ) -> ApplicationStatusHistory:
        orm = ApplicationStatusHistoryORM(
            application_id=history.application_id,
            previous_status=history.previous_status,
            new_status=history.new_status,
        )
        self._session.add(orm)
        await self._session.flush()
        await self._session.refresh(orm)
        return self._history_to_domain(orm)
