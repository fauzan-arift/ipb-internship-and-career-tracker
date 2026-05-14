from abc import ABC, abstractmethod
from typing import List, Optional
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
    async def count_by_internship(self, internship_id: UUID) -> int:
        ...

    @abstractmethod
    async def save(self, application: Application) -> Application:
        ...

    @abstractmethod
    async def save_status_history(
        self, history: ApplicationStatusHistory
    ) -> ApplicationStatusHistory:
        ...
