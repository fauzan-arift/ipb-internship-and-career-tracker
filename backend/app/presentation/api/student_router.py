"""
Student Profile Router
GET  /api/v1/students/profile  — get own profile
PUT  /api/v1/students/profile  — update own profile (partial)
"""
from fastapi import APIRouter, Depends

from app.application.services.student_service import StudentService
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork
from app.presentation.dependencies import get_uow, require_role
from app.presentation.schemas.student import StudentProfileUpdateRequest, StudentProfileResponse

router = APIRouter()


def get_student_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> StudentService:
    return StudentService(uow=uow)


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
