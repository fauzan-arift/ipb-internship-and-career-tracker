"""
HR Profile Router
GET  /api/v1/hr/company-profile  — get own company profile
PUT  /api/v1/hr/company-profile  — update own company profile (partial)
"""
from fastapi import APIRouter, Depends

from app.application.services.hr_service import HrService
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork
from app.presentation.dependencies import get_uow, require_role
from app.presentation.schemas.company import CompanyProfileUpdateRequest, CompanyProfileResponse

router = APIRouter()


def get_hr_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> HrService:
    return HrService(uow=uow)


@router.get(
    "/company-profile",
    summary="Lihat profil perusahaan saya",
    response_model=CompanyProfileResponse,
)
async def get_my_company_profile(
    current_user=Depends(require_role("HR")),
    svc: HrService = Depends(get_hr_service),
):
    """Mengembalikan profil perusahaan yang terhubung dengan akun HR yang sedang login."""
    company, photo_url = await svc.get_company_profile(hr_user_id=current_user.id)
    return CompanyProfileResponse(
        **company.model_dump(),
        photo_profile_url=photo_url,
    )


@router.put(
    "/company-profile",
    summary="Update profil perusahaan",
    response_model=CompanyProfileResponse,
)
async def update_my_company_profile(
    body: CompanyProfileUpdateRequest,
    current_user=Depends(require_role("HR")),
    svc: HrService = Depends(get_hr_service),
):
    """
    Update parsial profil perusahaan.
    Hanya field yang dikirim yang akan diubah.
    Gunakan `photo_profile_id` dari hasil endpoint `/documents/upload`.
    """
    data = body.model_dump(exclude_unset=True)
    updated, photo_url = await svc.update_company_profile(hr_user_id=current_user.id, payload=data)
    return CompanyProfileResponse(
        **updated.model_dump(),
        photo_profile_url=photo_url,
    )
