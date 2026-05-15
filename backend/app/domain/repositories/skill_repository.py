from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.skill import Skill


class ISkillRepository(ABC):
    @abstractmethod
    async def get_all_skills(self) -> List[Skill]:
        """Ambil semua data skill yang tersedia."""
        pass
