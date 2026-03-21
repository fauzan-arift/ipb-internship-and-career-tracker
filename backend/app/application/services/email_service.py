import logging

from app.core.config import settings
from app.domain.entities.user import User
from app.domain.entities.company import Company
from app.domain.entities.email_notification import EmailNotification
from app.domain.entities.enums import EmailNotificationStatus
from app.domain.unit_of_work import IUnitOfWork
from app.infrastructure.brevo_client import BrevoClient

logger = logging.getLogger(__name__)

class EmailService:

    def __init__(self, brevo_client: BrevoClient):
        self.brevo_client = brevo_client

    async def send_verification_email(self, user: User, token: str, uow: IUnitOfWork) -> None:
        verify_url = (
            f"{settings.BACKEND_URL}{settings.API_V1_STR}/auth/verify-email?token={token}"
        )
        subject = "Verifikasi Email Kamu - Internship Portal"
        html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#2d7d46">Verifikasi Email Kamu</h2>
            <p>Halo <strong>{user.full_name}</strong>,</p>
            <p>Klik tombol di bawah untuk memverifikasi email kamu:</p>
            <div style="margin:30px 0">
                <a href="{verify_url}" style="background:#2d7d46;color:white;padding:14px 24px;
                   text-decoration:none;border-radius:6px;font-weight:bold">Verifikasi Email</a>
            </div>
            <p style="color:#666">Link berlaku <strong>24 jam</strong>.</p>
            <p style="color:#999;font-size:12px">Atau copy link ini: {verify_url}</p>
        </div>"""
        send_status = await self._send(user.email, user.full_name, subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="EMAIL_VERIFICATION"
        )

    async def send_hr_pending_notification(self, user: User, company_name: str, uow: IUnitOfWork) -> None:
        subject = "Registrasi Kamu Sedang Diproses"
        html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1a73e8">Registrasi Kamu Sedang Diproses</h2>
            <p>Halo <strong>{user.full_name}</strong>,</p>
            <p>Registrasi HR kamu untuk perusahaan <strong>{company_name}</strong>
               sedang dalam tahap <strong>verifikasi admin</strong>.</p>
            <p>Estimasi: <strong>1–3 hari kerja</strong>. Kami akan email kamu hasilnya.</p>
        </div>"""
        send_status = await self._send(user.email, user.full_name, subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="HR_PENDING_NOTIFICATION"
        )

    async def send_admin_new_hr_notification(self, user: User, company: Company, uow: IUnitOfWork) -> None:
        admin_url = f"{settings.BACKEND_URL}{settings.API_V1_STR}/admin/pending-registrations"
        subject = f"Registrasi HR Baru - {company.company_name}"
        html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#d93025">Ada Registrasi HR Baru</h2>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
                <tr><td style="padding:8px;color:#666;width:40%">Nama</td>
                    <td style="padding:8px"><strong>{user.full_name}</strong></td></tr>
                <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Email</td>
                    <td style="padding:8px">{user.email}</td></tr>
                <tr><td style="padding:8px;color:#666">Perusahaan</td>
                    <td style="padding:8px"><strong>{company.company_name}</strong></td></tr>
                <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Industri</td>
                    <td style="padding:8px">{company.industry or '—'}</td></tr>
            </table>
            <a href="{admin_url}" style="background:#d93025;color:white;padding:12px 24px;
               text-decoration:none;border-radius:6px;font-weight:bold">Review Sekarang</a>
        </div>"""
        send_status = await self._send(settings.ADMIN_EMAIL, "Admin IPB", subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="ADMIN_HR_NOTIFICATION"
        )

    async def send_hr_approval_email(self, user: User, company_name: str, uow: IUnitOfWork) -> None:
        login_url = f"{settings.BASE_URL}/auth/login"
        subject = "Registrasi Kamu Telah Disetujui"
        html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#2d7d46">Registrasi Kamu Disetujui! 🎉</h2>
            <p>Halo <strong>{user.full_name}</strong>,</p>
            <p>Akun HR dan data perusahaan <strong>{company_name}</strong>
               kamu telah <strong>diverifikasi</strong>.</p>
            <div style="margin:30px 0">
                <a href="{login_url}" style="background:#2d7d46;color:white;padding:14px 24px;
                   text-decoration:none;border-radius:6px;font-weight:bold">Login Sekarang</a>
            </div>
        </div>"""
        send_status = await self._send(user.email, user.full_name, subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="HR_APPROVAL"
        )

    async def send_hr_rejection_email(self, user: User, reason: str, uow: IUnitOfWork) -> None:
        subject = "Registrasi Kamu Ditolak"
        html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#d93025">Registrasi Kamu Tidak Dapat Disetujui</h2>
            <p>Halo <strong>{user.full_name}</strong>,</p>
            <p>Mohon maaf, registrasi HR kamu telah <strong>ditolak</strong>.</p>
            <div style="background:#fff3f3;border-left:4px solid #d93025;padding:12px 16px;margin:16px 0">
                <strong>Alasan:</strong><br>{reason}
            </div>
            <p>Hubungi admin di <a href="mailto:{settings.ADMIN_EMAIL}">{settings.ADMIN_EMAIL}</a>
               jika ada pertanyaan.</p>
        </div>"""
        send_status = await self._send(user.email, user.full_name, subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="HR_REJECTION"
        )

    async def _send(self, to_email: str, to_name: str, subject: str, html_content: str) -> EmailNotificationStatus:
        ok = await self.brevo_client.send(to_email, to_name, subject, html_content)
        result = EmailNotificationStatus.SENT if ok else EmailNotificationStatus.FAILED
        if not ok:
            logger.error(
                "Email GAGAL dikirim ke %s (subject: %s). "
                "Periksa BREVO_API_KEY dan BREVO_SENDER_EMAIL di .env.",
                to_email, subject
            )
        else:
            logger.info("Email terkirim ke %s (subject: %s)", to_email, subject)
        return result

    async def _save_notification(
        self,
        uow: IUnitOfWork,
        recipient_id,
        subject: str,
        body: str,
        status: EmailNotificationStatus,
        ref_id: str = None,
        ref_type: str = None,
    ) -> None:
        try:
            notif = EmailNotification(
                recipient_id=recipient_id,
                subject=subject,
                body=body,
                status=status,
                reference_id=ref_id,
                reference_type=ref_type,
            )
            async with uow as u:
                await u.users.save_email_notification(notif)
                await u.commit()
        except Exception as exc:
            logger.error("Failed to save email notification: %s", exc)
