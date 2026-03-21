from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import decode_access_token
from app.domain.entities.enums import UserStatus
from app.domain.unit_of_work import IUnitOfWork
from app.infrastructure.database import AsyncSessionLocal
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork
from app.infrastructure.brevo_client import BrevoClient
from app.infrastructure.file_service import FileService
from app.application.services.email_service import EmailService
from app.application.services.auth_service import AuthService
from app.application.services.admin_service import AdminService

security = HTTPBearer()


def get_uow() -> SQLAlchemyUnitOfWork:
    return SQLAlchemyUnitOfWork(AsyncSessionLocal)


def get_brevo_client() -> BrevoClient:
    return BrevoClient()


def get_file_service() -> FileService:
    return FileService()


def get_email_service(
    brevo_client: BrevoClient = Depends(get_brevo_client),
) -> EmailService:
    return EmailService(brevo_client=brevo_client)


def get_auth_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
    email_service: EmailService = Depends(get_email_service),
    file_service: FileService = Depends(get_file_service),
) -> AuthService:
    return AuthService(uow=uow, email_service=email_service, file_service=file_service)


def get_admin_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
    email_service: EmailService = Depends(get_email_service),
) -> AdminService:
    return AdminService(uow=uow, email_service=email_service)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
):
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tidak bisa memvalidasi kredensial.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak valid.")

    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak valid.")

    async with uow as u:
        user = await u.users.get_by_id(user_id)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User tidak ditemukan.")

    if not user.is_verified():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun belum terverifikasi atau telah ditolak.",
        )
    return user


def require_role(*roles: str):
    async def _check(current_user=Depends(get_current_user)):
        if current_user.role.value not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Akses ditolak. Role yang dibutuhkan: {', '.join(roles)}.",
            )
        return current_user
    return _check
