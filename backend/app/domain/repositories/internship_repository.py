from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from uuid import UUID

from app.domain.entities.internship import Internship


class IInternshipRepository(ABC):

    @abstractmethod
    async def get_by_id(self, id: UUID) -> Optional[Internship]:
        ...

    @abstractmethod
    async def get_active_list(
        self,
        page: int,
        limit: int,
        search: Optional[str],
    ) -> Tuple[List[Internship], int]:
        """Returns (items, total_count)."""
        ...

    @abstractmethod
    async def get_by_company(
        self,
        company_id: UUID,
        page: int,
        limit: int,
        search: Optional[str],
    ) -> Tuple[List[Internship], int]:
        ...

    @abstractmethod
    async def save(self, internship: Internship) -> Internship:
        ...

    @abstractmethod
    async def delete(self, id: UUID) -> None:
        ...
