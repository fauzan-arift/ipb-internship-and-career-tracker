from typing import List

from app.domain.entities.skill import Skill
from app.domain.unit_of_work import IUnitOfWork


class SkillService:
    def __init__(self, uow: IUnitOfWork):
        self.uow = uow

    async def get_all_skills(self) -> List[Skill]:
        async with self.uow as u:
            skills = await u.skills.get_all_skills()
        return skills
