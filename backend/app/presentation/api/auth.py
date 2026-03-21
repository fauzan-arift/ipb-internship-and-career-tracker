from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status

from app.presentation.schemas.auth import (
    StudentRegisterRequest, HRRegisterRequest, LoginRequest,
    ResendVerificationRequest, TokenResponse, UserInfoResponse,
)
from app.presentation.dependencies import get_auth_service, get_current_user
from app.application.services.auth_service import AuthService

router = APIRouter()


@router.post("/register/student", status_code=status.HTTP_201_CREATED,
             summary="Registrasi Student")
async def register_student(
    data: StudentRegisterRequest,
    svc: AuthService = Depends(get_auth_service),
):
    user = await svc.register_student(data)
    return {
        "success": True,
        "message": "Registrasi berhasil! Cek email untuk link verifikasi.",
        "data": {"user_id": str(user.id), "email": user.email, "status": user.status.value},
    }


@router.post("/register/hr", status_code=status.HTTP_201_CREATED,
             summary="Registrasi HR + Upload NPWP")
async def register_hr(
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    company_name: str = Form(...),
    position: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    industry: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    company_email: Optional[str] = Form(None),
    npwp_file: Optional[UploadFile] = File(None),
    svc: AuthService = Depends(get_auth_service),
):
    data = HRRegisterRequest(
        full_name=full_name, email=email, password=password,
        company_name=company_name, position=position,
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


@router.get("/verify-email", summary="Verifikasi Email Student")
async def verify_email(
    token: str = Query(...),
    svc: AuthService = Depends(get_auth_service),
):
    await svc.verify_email(token)
    return {"success": True, "message": "Email berhasil diverifikasi! Kamu sekarang bisa login.", "data": None}


@router.post("/resend-verification", summary="Kirim Ulang Email Verifikasi")
async def resend_verification(
    data: ResendVerificationRequest,
    svc: AuthService = Depends(get_auth_service),
):
    await svc.resend_verification(data.email)
    return {
        "success": True,
        "message": "Jika email terdaftar dan belum diverifikasi, link baru telah dikirim.",
    }


@router.post("/login", summary="Login (semua role)")
async def login(
    data: LoginRequest,
    svc: AuthService = Depends(get_auth_service),
):
    token = await svc.login(data.email, data.password)
    return {
        "success": True,
        "message": "Login berhasil.",
        "data": {"access_token": token, "token_type": "bearer"},
    }
