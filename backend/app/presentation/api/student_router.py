"""
Student Router
GET  /api/v1/students/profile               — get own profile
PUT  /api/v1/students/profile               — update own profile (partial)
GET  /api/v1/students/applications          — list my applications + stats
GET  /api/v1/students/applications/{id}     — detail of a single application (with timeline & offer)
"""
from uuid import UUID

from fastapi import APIRouter, Depends

from app.application.services.student_service import StudentService
from app.application.services.application_service import ApplicationService
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork
from app.presentation.dependencies import get_uow, require_role
from app.presentation.schemas.student import StudentProfileUpdateRequest, StudentProfileResponse
from app.presentation.schemas.application import (
    StudentApplicationListResponse,
    StudentApplicationDetailResponse,
)

router = APIRouter()


def get_student_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> StudentService:
    return StudentService(uow=uow)


def get_application_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> ApplicationService:
    return ApplicationService(uow=uow)


@router.get(
    "/profile",
    summary="Lihat profil mahasiswa saya",
    response_model=StudentProfileResponse,
)
async def get_my_profile(
    current_user=Depends(require_role("STUDENT")),
    svc: StudentService = Depends(get_student_service),
):
    """Mengembalikan profil lengkap mahasiswa yang sedang login."""
    student, cv_url, photo_url = await svc.get_profile(user_id=current_user.id)
    return StudentProfileResponse(
        **student.model_dump(),
        cv_url=cv_url,
        photo_profile_url=photo_url,
    )


@router.put(
    "/profile",
    summary="Update profil mahasiswa",
    response_model=StudentProfileResponse,
)
async def update_my_profile(
    body: StudentProfileUpdateRequest,
    current_user=Depends(require_role("STUDENT")),
    svc: StudentService = Depends(get_student_service),
):
    """
    Update parsial profil mahasiswa.
    Hanya field yang dikirim yang akan diubah.
    Gunakan `cv_id` dan `photo_profile_id` dari hasil endpoint `/documents/upload`.
    """
    data = body.model_dump(exclude_unset=True)
    student, cv_url, photo_url = await svc.update_profile(user_id=current_user.id, payload=data)
    return StudentProfileResponse(
        **student.model_dump(),
        cv_url=cv_url,
        photo_profile_url=photo_url,
    )


@router.get(
    "/applications",
    summary="Daftar lamaran saya beserta statistik",
    response_model=StudentApplicationListResponse,
    tags=["Students"],
)
async def get_my_applications(
    current_user=Depends(require_role("STUDENT")),
    svc: ApplicationService = Depends(get_application_service),
):
    """
    Mengembalikan semua lamaran yang sudah dikirimkan oleh mahasiswa yang login,
    lengkap dengan statistik (total, diproses, diterima, ditolak).
    """
    return await svc.get_student_applications(student_user_id=current_user.id)


@router.get(
    "/applications/{application_id}",
    summary="Detail lamaran saya",
    response_model=StudentApplicationDetailResponse,
    tags=["Students"],
)
async def get_my_application_detail(
    application_id: UUID,
    current_user=Depends(require_role("STUDENT")),
    svc: ApplicationService = Depends(get_application_service),
):
    """
    Mengembalikan detail satu lamaran termasuk:
    - Info lowongan & perusahaan
    - Timeline riwayat status (terbaru di atas)
    - Detail penawaran (jika sudah ada)
    """
    return await svc.get_student_application_detail(
        student_user_id=current_user.id,
        application_id=application_id,
    )
