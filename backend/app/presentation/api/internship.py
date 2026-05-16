"""
Student-facing Internship Router
GET  /api/v1/internships/          — list active internships (paginated + search)
GET  /api/v1/internships/{id}      — internship detail
POST /api/v1/internships/{id}/apply — apply to internship (requires STUDENT role)
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.presentation.dependencies import get_uow, require_role
from app.presentation.schemas.internship import (
    PaginatedInternshipResponse,
    InternshipDetailResponse,
)
from app.presentation.schemas.application import ApplicationCreateRequest, ApplicationResponse
from app.application.services.internship_service import InternshipService
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork

router = APIRouter()


def get_internship_service(uow: SQLAlchemyUnitOfWork = Depends(get_uow)) -> InternshipService:
    return InternshipService(uow=uow)


@router.get(
    "",
    summary="Daftar lowongan magang aktif",
    response_model=PaginatedInternshipResponse,
    tags=["Internships"],
)
async def list_active_internships(
    page: int = Query(default=1, ge=1, description="Nomor halaman (mulai dari 1)"),
    limit: int = Query(default=10, ge=1, le=100, description="Jumlah item per halaman (maks 100)"),
    search: Optional[str] = Query(default=None, description="Cari berdasarkan judul atau deskripsi lowongan"),
    svc: InternshipService = Depends(get_internship_service),
):
    """
    Mengembalikan daftar lowongan magang yang **aktif** dan belum melewati `close_date`.
    Mendukung pencarian teks dan paginasi.
    """
    return await svc.list_active_internships(page=page, limit=limit, search=search)


@router.get(
    "/{internship_id}",
    summary="Detail lowongan magang",
    response_model=InternshipDetailResponse,
    tags=["Internships"],
)
async def get_internship_detail(
    internship_id: UUID,
    svc: InternshipService = Depends(get_internship_service),
):
    """Mengembalikan detail lengkap satu lowongan magang beserta informasi perusahaan."""
    return await svc.get_internship_detail(internship_id)


@router.post(
    "/{internship_id}/apply",
    summary="Lamar ke lowongan magang",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Internships"],
)
async def apply_to_internship(
    internship_id: UUID,
    body: ApplicationCreateRequest,
    current_user=Depends(require_role("STUDENT")),
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
    svc: InternshipService = Depends(get_internship_service),
):
    """
    Kirimkan lamaran ke lowongan magang (hanya untuk role **Student**).

    - `submitted_cv_id` harus berupa `id` dokumen CV yang sudah diupload via `POST /documents/upload`.
    - CV harus sudah terverifikasi sebelum bisa melamar.
    - Mahasiswa tidak bisa melamar ke lowongan yang sama dua kali.
    """
    async with uow as u:
        student = await u.users.get_student_profile_by_user_id(current_user.id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil mahasiswa tidak ditemukan.",
        )

    return await svc.apply_to_internship(
        internship_id=internship_id,
        student_user_id=current_user.id,
        student_profile_id=student.profile_id,
        submitted_cv_id=body.submitted_cv_id,
    )
