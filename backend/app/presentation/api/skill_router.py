from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.application.services.skill_service import SkillService
from app.presentation.dependencies import get_skill_service

router = APIRouter()

class SkillResponse(BaseModel):
    id: str
    name: str

    model_config = {"from_attributes": True}

@router.get(
    "",
    summary="Dapatkan semua skill yang tersedia",
    response_model=List[SkillResponse],
)
async def get_all_skills(svc: SkillService = Depends(get_skill_service)):
    skills = await svc.get_all_skills()
    return [SkillResponse(id=str(s.id), name=s.name) for s in skills]
