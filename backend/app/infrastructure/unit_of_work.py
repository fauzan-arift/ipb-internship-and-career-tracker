from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.domain.unit_of_work import IUnitOfWork
from app.infrastructure.repositories.user_repository import SQLAlchemyUserRepository
from app.infrastructure.repositories.company_repository import SQLAlchemyCompanyRepository
from app.infrastructure.repositories.document_repository import SQLAlchemyDocumentRepository


class SQLAlchemyUnitOfWork(IUnitOfWork):

    def __init__(self, session_factory: async_sessionmaker):
        self._session_factory = session_factory
        self._session: AsyncSession | None = None

    async def __aenter__(self) -> "SQLAlchemyUnitOfWork":
        self._session = self._session_factory()
        self.users = SQLAlchemyUserRepository(self._session)
        self.companies = SQLAlchemyCompanyRepository(self._session)
        self.documents = SQLAlchemyDocumentRepository(self._session)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type:
            await self.rollback()
        await self._session.close()

    async def commit(self) -> None:
        await self._session.commit()

    async def rollback(self) -> None:
        await self._session.rollback()
