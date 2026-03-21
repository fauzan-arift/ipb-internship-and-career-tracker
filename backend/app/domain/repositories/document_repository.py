from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from app.domain.entities.document import Document


class IDocumentRepository(ABC):

    @abstractmethod
    async def get_by_id(self, id: UUID) -> Optional[Document]:
        ...

    @abstractmethod
    async def save(self, document: Document) -> Document:
        ...
