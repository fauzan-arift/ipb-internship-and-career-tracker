from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.document import Document
from app.domain.repositories.document_repository import IDocumentRepository
from app.infrastructure.models.document import DocumentORM


class SQLAlchemyDocumentRepository(IDocumentRepository):

    def __init__(self, session: AsyncSession):
        self._session = session

    def _to_domain(self, orm: DocumentORM) -> Document:
        return Document(
            id=orm.id,
            document_type=orm.document_type,
            file_name=orm.file_name,
            file_url=orm.file_url,
            file_format=orm.file_format,
            upload_date=orm.upload_date,
            created_at=orm.created_at,
        )

    async def get_by_id(self, id: UUID) -> Optional[Document]:
        r = await self._session.execute(select(DocumentORM).where(DocumentORM.id == id))
        orm = r.scalars().first()
        return self._to_domain(orm) if orm else None

    async def save(self, document: Document) -> Document:
        existing = None
        if document.id:
            r = await self._session.execute(select(DocumentORM).where(DocumentORM.id == document.id))
            existing = r.scalars().first()

        if existing:
            existing.file_url = document.file_url
            existing.file_name = document.file_name
            existing.file_format = document.file_format
            orm = existing
        else:
            orm = DocumentORM(
                document_type=document.document_type,
                file_name=document.file_name,
                file_url=document.file_url,
                file_format=document.file_format,
            )
            self._session.add(orm)

        await self._session.flush()
        return document.model_copy(update={"id": orm.id})
