from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.domain.entities.skill import Skill
from app.domain.repositories.skill_repository import ISkillRepository
from app.infrastructure.models.skill import SkillORM


class SQLAlchemySkillRepository(ISkillRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_skills(self) -> List[Skill]:
        result = await self.session.execute(select(SkillORM).order_by(SkillORM.name.asc()))
        skills = result.scalars().all()
        return [Skill.model_validate(s) for s in skills]
