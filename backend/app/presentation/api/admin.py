from uuid import UUID

from fastapi import APIRouter, Depends, status
from fastapi.responses import RedirectResponse

from app.presentation.schemas.admin import RejectRequest, HRDetail
from app.presentation.dependencies import get_admin_service, require_role
from app.application.services.admin_service import AdminService

router = APIRouter()
_admin_dep = [Depends(require_role("ADMIN"))]


@router.get(
    "/pending-registrations",
    dependencies=_admin_dep,
    summary="List HR dengan status PENDING",
    tags=["Admin"],
)
async def list_pending_hr(svc: AdminService = Depends(get_admin_service)):
    """
    Mengembalikan daftar semua akun HR yang sedang menunggu persetujuan Admin.

    Setiap item berisi informasi pribadi HR dan nama perusahaan yang didaftarkan.
    Gunakan `hr_profile_id` untuk memanggil endpoint approve/reject.

    **Response fields per item:** `hr_profile_id`, `full_name`, `email`, `position`,
    `phone_number`, `company_name`, `registered_at`
    """
    items = await svc.get_pending_registrations()
    return {"success": True, "message": "OK", "data": items}


@router.get(
    "/hr/history",
    dependencies=_admin_dep,
    summary="List HR yang sudah diproses (VERIFIED/REJECTED)",
    tags=["Admin"],
)
async def list_processed_hr(svc: AdminService = Depends(get_admin_service)):
    """
    Mengembalikan daftar semua akun HR yang sudah diproses (disetujui atau ditolak).

    Field `status` menunjukkan status akhir: `VERIFIED` atau `REJECTED`.
    Field `verified_at` berisi tanggal approval (null jika ditolak).

    **Response fields per item:** semua field `pending-registrations` + `status` + `verified_at`
    """
    items = await svc.get_processed_registrations()
    return {"success": True, "message": "OK", "data": items}


@router.get(
    "/hr/profile/{hr_profile_id}",
    dependencies=_admin_dep,
    summary="Detail HR + Perusahaan + NPWP",
    response_model=HRDetail,
    tags=["Admin"],
)
async def get_hr_detail(hr_profile_id: UUID, svc: AdminService = Depends(get_admin_service)):
    """
    Mengembalikan detail lengkap satu HR meliputi:
    - **Profil pribadi** (`hr`): nama, email, posisi, nomor telepon, status.
    - **Profil perusahaan** (`company`): nama, alamat, industri, website.
    - **Dokumen NPWP** (`npwp_document`): nama file, format, dan URL download.

    `hr_profile_id` adalah `id` dari tabel `hrs` (bukan `users.id`).
    """
    detail = await svc.get_hr_detail(hr_profile_id)
    return detail


@router.post(
    "/hr/profile/{hr_profile_id}/approve",
    dependencies=_admin_dep,
    summary="Approve registrasi HR",
    tags=["Admin"],
)
async def approve_hr(hr_profile_id: UUID, svc: AdminService = Depends(get_admin_service)):
    """
    Setujui pendaftaran HR.

    - Status user berubah dari `PENDING` → `VERIFIED`.
    - Status perusahaan berubah ke `VERIFIED`.
    - Email notifikasi persetujuan dikirim ke HR.
    """
    await svc.approve_hr(hr_profile_id)
    return {"success": True, "message": "HR berhasil diapprove.", "data": None}


@router.post(
    "/hr/profile/{hr_profile_id}/reject",
    dependencies=_admin_dep,
    summary="Tolak registrasi HR",
    tags=["Admin"],
)
async def reject_hr(
    hr_profile_id: UUID,
    body: RejectRequest,
    svc: AdminService = Depends(get_admin_service),
):
    """
    Tolak pendaftaran HR dengan menyertakan alasan penolakan.

    - Status user berubah dari `PENDING` → `REJECTED`.
    - Email notifikasi penolakan beserta `reason` dikirim ke HR.
    - HR dapat mendaftar ulang menggunakan email yang sama.
    """
    await svc.reject_hr(hr_profile_id, body.reason)
    return {"success": True, "message": "HR telah ditolak.", "data": None}


@router.get(
    "/documents/{document_id}",
    dependencies=_admin_dep,
    summary="Redirect ke Cloudinary URL dokumen",
    tags=["Admin"],
    status_code=status.HTTP_302_FOUND,
)
async def get_document(document_id: UUID, svc: AdminService = Depends(get_admin_service)):
    """
    Redirect ke URL Cloudinary dari dokumen (misalnya file NPWP).
    Gunakan `document_id` dari field `npwp_document.document_id` di endpoint detail HR.
    """
    url = await svc.get_document_url(document_id)
    return RedirectResponse(url=url, status_code=status.HTTP_302_FOUND)
