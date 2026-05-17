from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from uuid import UUID

from app.domain.entities.application import Application, ApplicationStatusHistory


class IApplicationRepository(ABC):

    @abstractmethod
    async def get_by_id(self, id: UUID) -> Optional[Application]:
        ...

    @abstractmethod
    async def get_by_student_and_internship(
        self, student_id: UUID, internship_id: UUID
    ) -> Optional[Application]:
        ...

    @abstractmethod
    async def list_by_student(self, student_id: UUID) -> List[Application]:
        ...

    @abstractmethod
    async def list_by_internship(
        self,
        internship_id: UUID,
        status_filter: Optional[str],
        page: int,
        limit: int,
    ) -> Tuple[List[Application], int]:
        ...

    @abstractmethod
    async def get_status_history(self, application_id: UUID) -> List[ApplicationStatusHistory]:
        ...

    @abstractmethod
    async def count_by_internship(self, internship_id: UUID) -> int:
        ...

    @abstractmethod
    async def count_accepted_by_internship(self, internship_id: UUID) -> int:
        ...

    @abstractmethod
    async def count_accepted_by_internship_ids(self, internship_ids: List[UUID]) -> dict[UUID, int]:
        ...

    @abstractmethod
    async def save(self, application: Application) -> Application:
        ...

    @abstractmethod
    async def save_status_history(
        self, history: ApplicationStatusHistory
    ) -> ApplicationStatusHistory:
        ...
