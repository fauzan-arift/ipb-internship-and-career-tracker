from uuid import UUID

from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.application.services.student_service import StudentService
from app.application.services.application_service import ApplicationService
from app.application.services.offer_service import OfferService
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork
from app.presentation.dependencies import get_uow, require_role
from app.presentation.schemas.student import StudentProfileUpdateRequest, StudentProfileResponse
from app.presentation.schemas.application import (
    StudentApplicationListResponse,
    StudentApplicationDetailResponse,
)
from app.presentation.schemas.offer import (
    StudentOfferListResponse,
    OfferRespondRequest,
    OfferResponse,
)
from app.application.services.career_mapping_service import CareerMappingService
from app.presentation.schemas.career_mapping import CareerMappingResponse

router = APIRouter()


def get_student_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> StudentService:
    return StudentService(uow=uow)


def get_application_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> ApplicationService:
    return ApplicationService(uow=uow)


def get_offer_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> OfferService:
    return OfferService(uow=uow)


def get_career_mapping_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> CareerMappingService:
    return CareerMappingService(uow=uow)


@router.get(
    "/profile",
    summary="Lihat profil mahasiswa saya",
    response_model=StudentProfileResponse,
)
async def get_my_profile(
    current_user=Depends(require_role("STUDENT")),
    svc: StudentService = Depends(get_student_service),
):
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
    return await svc.get_student_application_detail(
        student_user_id=current_user.id,
        application_id=application_id,
    )





@router.get(
    "/offers",
    summary="Daftar penawaran yang saya terima",
    response_model=StudentOfferListResponse,
    tags=["Students"],
)
async def get_my_offers(
    status: Optional[str] = Query(
        default=None,
        description="Filter status: Pending | Accepted | Rejected",
    ),
    current_user=Depends(require_role("STUDENT")),
    svc: OfferService = Depends(get_offer_service),
):
    return await svc.get_student_offers(
        student_user_id=current_user.id,
        status_filter=status,
    )


@router.patch(
    "/offers/{offer_id}/respond",
    summary="Terima atau tolak penawaran",
    response_model=OfferResponse,
    tags=["Students"],
)
async def respond_to_offer(
    offer_id: UUID,
    body: OfferRespondRequest,
    current_user=Depends(require_role("STUDENT")),
    svc: OfferService = Depends(get_offer_service),
):
    """
    Mahasiswa menerima atau menolak penawaran magang.

    **Request body:**
    ```json
    { "response_status": "Accepted" }  // atau "Rejected"
    ```

    **Validasi server:**
    - Penawaran harus milik lamaran mahasiswa yang login.
    - Tanggal hari ini tidak boleh melebihi `expiry_date`.
    - Status penawaran harus masih 'Pending'.

    **Side-effects (atomik):**
    - Status penawaran diperbarui.
    - Status lamaran diperbarui ke 'Diterima' / 'Ditolak'.
    - Riwayat perubahan status lamaran dicatat.
    """
    return await svc.respond_to_offer(
        student_user_id=current_user.id,
        offer_id=offer_id,
        payload=body,
    )





@router.get(
    "/career-mapping",
    summary="Peta karir alumni dari jurusan saya",
    response_model=CareerMappingResponse,
    tags=["Students"],
)
async def get_career_mapping(
    current_user=Depends(require_role("STUDENT")),
    svc: CareerMappingService = Depends(get_career_mapping_service),
):
    """
    Mengembalikan distribusi alumni magang dari jurusan yang sama dengan
    mahasiswa yang sedang login, dikelompokkan per perusahaan.

    **Catatan:** Jumlah alumni hanya bertambah ketika mahasiswa
    *menerima* (Accept) penawaran magang secara resmi.
    """
    return await svc.get_career_mapping(student_user_id=current_user.id)
