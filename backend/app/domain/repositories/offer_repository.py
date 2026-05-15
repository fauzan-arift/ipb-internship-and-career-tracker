from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from app.domain.entities.offer import Offer


class IOfferRepository(ABC):

    @abstractmethod
    async def get_by_id(self, offer_id: UUID) -> Optional[Offer]:
        ...

    @abstractmethod
    async def get_by_application_id(self, application_id: UUID) -> Optional[Offer]:
        ...

    @abstractmethod
    async def list_by_student_id(
        self,
        student_id: UUID,
        status_filter: Optional[str] = None,
    ) -> List[Offer]:
        ...

    @abstractmethod
    async def save(self, offer: Offer) -> Offer:
        ...
