"""
HR-facing Internship Router
All routes are protected by require_role("HR").

GET    /api/v1/hr/internships/            — list company's internships
POST   /api/v1/hr/internships/            — create internship
PUT    /api/v1/hr/internships/{id}        — update internship
PATCH  /api/v1/hr/internships/{id}/close  — close (soft-delete) internship
PATCH  /api/v1/hr/internships/{id}/reopen — reopen a closed internship
DELETE /api/v1/hr/internships/{id}        — hard delete internship (no applicants)
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.presentation.dependencies import get_uow, require_role
from app.presentation.schemas.internship import (
    InternshipCreateRequest,
    InternshipUpdateRequest,
    InternshipReopenRequest,
    InternshipDetailResponse,
    PaginatedInternshipResponse,
)
from app.application.services.internship_service import InternshipService
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork

router = APIRouter()

_hr_dep = Depends(require_role("HR"))


def get_internship_service(uow: SQLAlchemyUnitOfWork = Depends(get_uow)) -> InternshipService:
    return InternshipService(uow=uow)


async def _resolve_company_id(
    current_user=Depends(require_role("HR")),
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> UUID:
    """Dependency: resolve the HR's company_id from their authenticated user."""
    async with uow as u:
        hr = await u.users.get_hr_by_user_id(current_user.id)
        if not hr:
            raise HTTPException(status_code=404, detail="Profil HR tidak ditemukan.")
        company = await u.companies.get_by_hr_id(hr.profile_id)
        if not company:
            raise HTTPException(status_code=404, detail="Perusahaan HR tidak ditemukan.")
    return company.id


@router.get(
    "",
    summary="Daftar lowongan milik perusahaan HR",
    response_model=PaginatedInternshipResponse,
)
async def list_hr_internships(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    search: Optional[str] = Query(default=None),
    company_id: UUID = Depends(_resolve_company_id),
    svc: InternshipService = Depends(get_internship_service),
):
    return await svc.list_hr_internships(
        company_id=company_id, page=page, limit=limit, search=search
    )


@router.post(
    "",
    summary="Buat lowongan magang baru",
    response_model=InternshipDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_internship(
    body: InternshipCreateRequest,
    company_id: UUID = Depends(_resolve_company_id),
    svc: InternshipService = Depends(get_internship_service),
):
    return await svc.create_internship(company_id=company_id, payload=body)


@router.put(
    "/{internship_id}",
    summary="Update lowongan magang",
    response_model=InternshipDetailResponse,
)
async def update_internship(
    internship_id: UUID,
    body: InternshipUpdateRequest,
    company_id: UUID = Depends(_resolve_company_id),
    svc: InternshipService = Depends(get_internship_service),
):
    return await svc.update_internship(
        internship_id=internship_id, company_id=company_id, payload=body
    )


@router.patch(
    "/{internship_id}/close",
    summary="Tutup lowongan magang (soft close)",
    response_model=InternshipDetailResponse,
)
async def close_internship(
    internship_id: UUID,
    company_id: UUID = Depends(_resolve_company_id),
    svc: InternshipService = Depends(get_internship_service),
):
    return await svc.close_internship(
        internship_id=internship_id, company_id=company_id
    )


@router.delete(
    "/{internship_id}",
    summary="Hapus lowongan magang (hard delete, hanya jika belum ada pelamar)",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_internship(
    internship_id: UUID,
    company_id: UUID = Depends(_resolve_company_id),
    svc: InternshipService = Depends(get_internship_service),
):
    await svc.delete_internship(internship_id=internship_id, company_id=company_id)


@router.patch(
    "/{internship_id}/reopen",
    summary="Buka kembali lowongan yang sudah ditutup",
    response_model=InternshipDetailResponse,
)
async def reopen_internship(
    internship_id: UUID,
    body: InternshipReopenRequest,
    company_id: UUID = Depends(_resolve_company_id),
    svc: InternshipService = Depends(get_internship_service),
):
    return await svc.reopen_internship(
        internship_id=internship_id, company_id=company_id, payload=body
    )
