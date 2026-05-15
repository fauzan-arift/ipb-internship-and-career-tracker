from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID

from app.domain.entities.offer import Offer


class IOfferRepository(ABC):

    @abstractmethod
    async def get_by_application_id(self, application_id: UUID) -> Optional[Offer]:
        ...

    @abstractmethod
    async def save(self, offer: Offer) -> Offer:
        ...
