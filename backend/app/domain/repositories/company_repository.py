from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from app.domain.entities.company import Company


class ICompanyRepository(ABC):

    @abstractmethod
    async def get_by_id(self, id: UUID) -> Optional[Company]:
        ...

    @abstractmethod
    async def get_by_hr_id(self, hr_id: UUID) -> Optional[Company]:
        ...

    @abstractmethod
    async def save(self, company: Company) -> Company:
        ...
