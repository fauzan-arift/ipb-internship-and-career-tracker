"""
HR Router
GET  /api/v1/hr/company-profile                                   — get own company profile
PUT  /api/v1/hr/company-profile                                   — update own company profile
GET  /api/v1/hr/internships/{internship_id}/applications          — list applicants for internship
GET  /api/v1/hr/applications/{application_id}                     — detail view of an applicant
PATCH /api/v1/hr/applications/{application_id}/status             — update application status
POST  /api/v1/hr/applications/{application_id}/offers             — create a job offer
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.application.services.hr_service import HrService
from app.application.services.application_service import ApplicationService
from app.application.services.offer_service import OfferService
from app.application.services.email_service import EmailService
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork
from app.presentation.dependencies import get_uow, get_email_service, require_role
from app.presentation.schemas.company import (
    CompanyProfileUpdateRequest,
    CompanyProfileResponse,
    HRProfileResponse,
    HRProfileUpdateRequest,
)
from app.presentation.schemas.application import (
    ApplicationStatusUpdateRequest,
    PaginatedHRApplicantResponse,
    HRApplicantDetailResponse,
    PaginatedHRAllApplicantResponse,
)
from app.presentation.schemas.offer import OfferCreateRequest, OfferResponse

router = APIRouter()


def get_hr_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> HrService:
    return HrService(uow=uow)


def get_application_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
    email_svc: EmailService = Depends(get_email_service),
) -> ApplicationService:
    return ApplicationService(uow=uow, email_service=email_svc)


def get_offer_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
) -> OfferService:
    return OfferService(uow=uow)


# ─── HR Personal Profile ──────────────────────────────────────────────────────

@router.get(
    "/profile",
    summary="Lihat profil pribadi HR saya",
    response_model=HRProfileResponse,
    tags=["HR - Profile"],
)
async def get_my_hr_profile(
    current_user=Depends(require_role("HR")),
    svc: HrService = Depends(get_hr_service),
):
    """Mengembalikan data pribadi HR yang sedang login (nama, posisi, nomor telepon)."""
    hr = await svc.get_hr_profile(hr_user_id=current_user.id)
    return HRProfileResponse(
        id=hr.id,
        full_name=hr.full_name,
        email=hr.email,
        position=hr.position,
        phone_number=hr.phone_number,
    )


@router.put(
    "/profile",
    summary="Update profil pribadi HR",
    response_model=HRProfileResponse,
    tags=["HR - Profile"],
)
async def update_my_hr_profile(
    body: HRProfileUpdateRequest,
    current_user=Depends(require_role("HR")),
    svc: HrService = Depends(get_hr_service),
):
    """
    Update parsial profil pribadi HR (nama lengkap, posisi, nomor telepon).
    Hanya field yang dikirim yang akan diubah.
    """
    data = body.model_dump(exclude_unset=True)
    hr = await svc.update_hr_profile(hr_user_id=current_user.id, payload=data)
    return HRProfileResponse(
        id=hr.id,
        full_name=hr.full_name,
        email=hr.email,
        position=hr.position,
        phone_number=hr.phone_number,
    )


# ─── Company Profile ──────────────────────────────────────────────────────────

@router.get(
    "/company-profile",
    summary="Lihat profil perusahaan saya",
    response_model=CompanyProfileResponse,
    tags=["HR - Profile"],
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
    tags=["HR - Profile"],
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


# ─── Applicant Management ─────────────────────────────────────────────────────

@router.get(
    "/internships/{internship_id}/applications",
    summary="Daftar pelamar untuk lowongan tertentu",
    response_model=PaginatedHRApplicantResponse,
    tags=["HR - Applications"],
)
async def list_applicants(
    internship_id: UUID,
    status_filter: Optional[str] = Query(default=None, alias="status", description="Filter by status"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    current_user=Depends(require_role("HR")),
    svc: ApplicationService = Depends(get_application_service),
):
    """
    Mengembalikan daftar pelamar untuk lowongan yang dimiliki perusahaan HR.
    Mendukung filter status dan paginasi.
    """
    return await svc.list_hr_applicants(
        hr_user_id=current_user.id,
        internship_id=internship_id,
        status_filter=status_filter,
        page=page,
        limit=limit,
    )


@router.get(
    "/applications",
    summary="Semua pelamar dari seluruh lowongan saya",
    response_model=PaginatedHRAllApplicantResponse,
    tags=["HR - Applications"],
)
async def list_all_applicants(
    status_filter: Optional[str] = Query(default=None, alias="status", description="Filter by status"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    current_user=Depends(require_role("HR")),
    svc: ApplicationService = Depends(get_application_service),
):
    """
    Mengembalikan semua pelamar dari **seluruh** lowongan yang diposting oleh perusahaan HR.
    Response menyertakan `internship_id` dan `internship_title` pada setiap item.
    Mendukung filter status dan paginasi.
    """
    return await svc.list_all_hr_applicants(
        hr_user_id=current_user.id,
        status_filter=status_filter,
        page=page,
        limit=limit,
    )


@router.get(
    "/applications/{application_id}",
    summary="Detail pelamar",
    response_model=HRApplicantDetailResponse,
    tags=["HR - Applications"],
)
async def get_applicant_detail(
    application_id: UUID,
    current_user=Depends(require_role("HR")),
    svc: ApplicationService = Depends(get_application_service),
):
    """
    Mengembalikan profil lengkap mahasiswa pelamar beserta riwayat status lamaran.
    """
    return await svc.get_hr_applicant_detail(
        hr_user_id=current_user.id,
        application_id=application_id,
    )


@router.patch(
    "/applications/{application_id}/status",
    summary="Update status lamaran",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["HR - Applications"],
)
async def update_application_status(
    application_id: UUID,
    body: ApplicationStatusUpdateRequest,
    current_user=Depends(require_role("HR")),
    svc: ApplicationService = Depends(get_application_service),
):
    """
    Mengubah status lamaran dan secara otomatis mencatat perubahan ke ApplicationStatusHistory.
    Status yang valid: Diproses, Review HR, Ditolak, Diterima, Ditawarkan, dll.
    """
    await svc.update_application_status(
        hr_user_id=current_user.id,
        application_id=application_id,
        new_status=body.new_status,
    )


# ─── Offer ────────────────────────────────────────────────────────────────────

@router.post(
    "/applications/{application_id}/offers",
    summary="Buat penawaran kerja untuk pelamar",
    response_model=OfferResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["HR - Applications"],
)
async def create_offer(
    application_id: UUID,
    body: OfferCreateRequest,
    current_user=Depends(require_role("HR")),
    svc: OfferService = Depends(get_offer_service),
):
    """
    Membuat penawaran magang untuk pelamar yang sudah diterima.
    Secara otomatis mengubah status lamaran ke 'Ditawarkan' dan mencatat riwayat.
    `offering_file_id` harus diupload terlebih dahulu via endpoint `/documents/upload`.
    """
    return await svc.create_offer(
        hr_user_id=current_user.id,
        application_id=application_id,
        payload=body,
    )
