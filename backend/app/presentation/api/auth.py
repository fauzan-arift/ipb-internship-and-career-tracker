from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status

from app.presentation.schemas.auth import (
    StudentRegisterRequest, HRRegisterRequest, LoginRequest,
    ResendVerificationRequest, TokenResponse, UserInfoResponse,
)
from app.presentation.dependencies import get_auth_service, get_current_user
from app.application.services.auth_service import AuthService

router = APIRouter()


@router.post(
    "/register/student",
    status_code=status.HTTP_201_CREATED,
    summary="Registrasi Mahasiswa",
    tags=["Authentication"],
)
async def register_student(
    data: StudentRegisterRequest,
    svc: AuthService = Depends(get_auth_service),
):
    """
    Daftarkan akun mahasiswa baru.

    - Email **harus** menggunakan domain `@apps.ipb.ac.id`.
    - NIM harus berformat 1 huruf + 10 digit (contoh: `G6401231040`).
    - Setelah registrasi, link verifikasi email akan dikirim ke inbox mahasiswa.
    - Akun **belum bisa login** sampai email terverifikasi.
    """
    user = await svc.register_student(data)
    return {
        "success": True,
        "message": "Registrasi berhasil! Cek email untuk link verifikasi.",
        "data": {"user_id": str(user.id), "email": user.email, "status": user.status.value},
    }


@router.post(
    "/register/hr",
    status_code=status.HTTP_201_CREATED,
    summary="Registrasi HR + Upload NPWP",
    tags=["Authentication"],
)
async def register_hr(
    full_name: str = Form(..., description="Nama lengkap HR"),
    email: str = Form(..., description="Email HR (bebas domain)"),
    password: str = Form(..., description="Password minimal 8 karakter"),
    company_name: str = Form(..., description="Nama perusahaan"),
    position: Optional[str] = Form(None, description="Jabatan HR di perusahaan"),
    phone_number: Optional[str] = Form(None, description="Nomor telepon HR"),
    address: Optional[str] = Form(None, description="Alamat perusahaan"),
    industry: Optional[str] = Form(None, description="Industri perusahaan (contoh: Teknologi)"),
    website: Optional[str] = Form(None, description="Website perusahaan"),
    description: Optional[str] = Form(None, description="Deskripsi singkat perusahaan"),
    company_email: Optional[str] = Form(None, description="Email resmi perusahaan"),
    npwp_file: Optional[UploadFile] = File(None, description="File NPWP perusahaan (PDF/JPG/PNG)"),
    svc: AuthService = Depends(get_auth_service),
):
    """
    Daftarkan akun HR beserta data perusahaan.

    - Request menggunakan **multipart/form-data** karena bisa menyertakan file NPWP.
    - Setelah registrasi, akun HR masuk status **PENDING** hingga disetujui Admin.
    - HR **tidak perlu** verifikasi email — Admin yang akan approve/reject akun.
    - `phone_number` adalah nomor telepon personal HR (bukan nomor perusahaan).
    """
    data = HRRegisterRequest(
        full_name=full_name, email=email, password=password,
        company_name=company_name, position=position,
        phone_number=phone_number,
        address=address, industry=industry, website=website,
        description=description,
        company_email=company_email if company_email else None,
    )
    user = await svc.register_hr(data, npwp_file)
    return {
        "success": True,
        "message": "Registrasi berhasil! Menunggu verifikasi admin.",
        "data": {"user_id": str(user.id), "email": user.email, "status": user.status.value},
    }


@router.get(
    "/verify-email",
    summary="Verifikasi Email Mahasiswa",
    tags=["Authentication"],
)
async def verify_email(
    token: str = Query(..., description="Token verifikasi yang dikirim ke email"),
    svc: AuthService = Depends(get_auth_service),
):
    """
    Verifikasi email mahasiswa menggunakan token dari link yang dikirim saat registrasi.
    Token berlaku selama **24 jam**. Gunakan endpoint `resend-verification` jika kedaluwarsa.
    """
    await svc.verify_email(token)
    return {"success": True, "message": "Email berhasil diverifikasi! Kamu sekarang bisa login.", "data": None}


@router.post(
    "/resend-verification",
    summary="Kirim Ulang Email Verifikasi",
    tags=["Authentication"],
)
async def resend_verification(
    data: ResendVerificationRequest,
    svc: AuthService = Depends(get_auth_service),
):
    """
    Kirim ulang link verifikasi email ke alamat yang terdaftar.
    Endpoint ini selalu mengembalikan sukses (untuk mencegah email enumeration).
    """
    await svc.resend_verification(data.email)
    return {
        "success": True,
        "message": "Jika email terdaftar dan belum diverifikasi, link baru telah dikirim.",
    }


@router.post(
    "/login",
    summary="Login (semua role)",
    tags=["Authentication"],
)
async def login(
    data: LoginRequest,
    svc: AuthService = Depends(get_auth_service),
):
    """
    Login dengan email dan password. Berlaku untuk semua role: **Student**, **HR**, **Admin**.

    Response berisi `access_token` bertipe **Bearer** yang harus disertakan di header:
    ```
    Authorization: Bearer <access_token>
    ```
    Token berisi informasi `sub` (user_id), `email`, dan `role`.
    """
    token = await svc.login(data.email, data.password)
    return {
        "success": True,
        "message": "Login berhasil.",
        "data": {"access_token": token, "token_type": "bearer"},
    }
