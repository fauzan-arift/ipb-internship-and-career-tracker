import logging
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException, UploadFile, status

from app.core.security import (
    get_password_hash, verify_password, create_access_token,
    generate_verification_token, hash_token,
)
from app.domain.entities.user import User
from app.domain.entities.student import Student
from app.domain.entities.hr import HR
from app.domain.entities.company import Company
from app.domain.entities.verification_token import VerificationToken
from app.domain.entities.enums import UserRole, UserStatus, CompanyVerificationStatus, DocumentType
from app.domain.unit_of_work import IUnitOfWork
from app.application.services.email_service import EmailService
from app.infrastructure.file_service import FileService

logger = logging.getLogger(__name__)
TOKEN_EXPIRY_HOURS = 24

class AuthService:
    def __init__(
        self,
        uow: IUnitOfWork,
        email_service: EmailService,
        file_service: FileService,
    ):
        self.uow = uow
        self.email_service = email_service
        self.file_service = file_service

    async def register_student(self, data) -> User:
        async with self.uow as uow:
            existing = await uow.users.get_by_email(data.email)
            if existing:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email sudah terdaftar.")

            if not data.email.lower().endswith("@apps.ipb.ac.id"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email student harus menggunakan domain @apps.ipb.ac.id."
                )

            student = Student(
                full_name=data.full_name,
                email=data.email,
                password_hash=get_password_hash(data.password),
                role=UserRole.STUDENT,
                status=UserStatus.UNVERIFIED,
                nim=data.nim.upper(),
                major=data.major,
                faculty=data.faculty,
                graduation_year=data.graduation_year,
                gpa=data.gpa,
                phone_number=data.phone_number,
                skills=[],
            )

            user = await uow.users.save(User(
                full_name=student.full_name,
                email=student.email,
                password_hash=student.password_hash,
                role=student.role,
                status=student.status,
            ))
            student = student.model_copy(update={"id": user.id})
            await uow.users.save_student(student)

            plain_token = generate_verification_token()
            token = VerificationToken(
                user_id=user.id,
                token_hash=hash_token(plain_token),
                expires_at=datetime.now(tz=timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS),
            )
            await uow.users.save_verification_token(token)
            await uow.commit()

        await self.email_service.send_verification_email(user, plain_token, self.uow)
        return user

    async def register_hr(self, data, npwp_file: UploadFile = None) -> User:
        async with self.uow as uow:
            existing = await uow.users.get_by_email(data.email)
            existing_hr = None
            existing_company = None
            
            if existing:
                if existing.role == UserRole.HR and existing.status == UserStatus.REJECTED:
                    existing_hr = await uow.users.get_hr_by_user_id(existing.id)
                    if existing_hr:
                        existing_company = await uow.companies.get_by_hr_id(existing_hr.profile_id)
                else:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email sudah terdaftar.")

            doc = None
            if npwp_file and npwp_file.filename:
                doc = await self.file_service.upload_document(npwp_file, DocumentType.NPWP.value, uow)

            user = await uow.users.save(User(
                id=existing.id if existing else None,
                full_name=data.full_name,
                email=data.email,
                password_hash=get_password_hash(data.password),
                role=UserRole.HR,
                status=UserStatus.PENDING,
            ))

            hr = HR(
                id=user.id,
                profile_id=existing_hr.profile_id if existing_hr else None,
                full_name=data.full_name,
                email=data.email,
                password_hash=user.password_hash,
                role=UserRole.HR,
                status=UserStatus.PENDING,
                position=data.position,
            )
            hr = await uow.users.save_hr(hr)

            company = Company(
                id=existing_company.id if existing_company else None,
                hr_id=hr.profile_id,
                company_name=data.company_name,
                address=data.address,
                industry=data.industry,
                website=data.website,
                description=data.description,
                email=str(data.company_email) if data.company_email else None,
                npwp_document_id=doc.id if doc else (existing_company.npwp_document_id if existing_company else None),
                verification_status=CompanyVerificationStatus.PENDING,
            )
            company = await uow.companies.save(company)
            await uow.commit()

        await self.email_service.send_hr_pending_notification(user, company.company_name, self.uow)
        await self.email_service.send_admin_new_hr_notification(user, company, self.uow)
        return user

    async def verify_email(self, plain_token: str) -> bool:
        async with self.uow as uow:
            token_hash = hash_token(plain_token)
            token = await uow.users.get_verification_token(token_hash)

            if not token:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token tidak valid.")
            if token.is_used:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token sudah digunakan.")
            if token.is_expired():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Token kedaluwarsa. Silakan request kirim ulang email verifikasi."
                )

            token = token.model_copy(update={"is_used": True})
            await uow.users.save_verification_token(token)

            user = await uow.users.get_by_id(token.user_id)
            if not user:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User tidak ditemukan.")
            user = user.model_copy(update={"status": UserStatus.VERIFIED})
            await uow.users.save(user)
            await uow.commit()

        return True

    async def resend_verification(self, email: str) -> None:
        async with self.uow as uow:
            user = await uow.users.get_by_email(email)
            if not user:
                return

            if not user.needs_email_verification():
                raise HTTPException(status_code=400, detail="Akun tidak memerlukan verifikasi email.")

            await uow.users.invalidate_old_tokens(user.id)
            plain_token = generate_verification_token()
            token = VerificationToken(
                user_id=user.id,
                token_hash=hash_token(plain_token),
                expires_at=datetime.now(tz=timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS),
            )
            await uow.users.save_verification_token(token)
            await uow.commit()

        await self.email_service.send_verification_email(user, plain_token, self.uow)
        
    async def login(self, email: str, password: str) -> str:
        async with self.uow as uow:
            user = await uow.users.get_by_email(email)

        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email atau password salah.")

        if not user.can_login():
            reason = user.login_blocked_reason()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=reason)

        token = create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role.value}
        )
        return token
