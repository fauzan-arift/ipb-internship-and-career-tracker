import logging
from html import escape
from typing import Optional

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
            f"{settings.FRONTEND_URL}/verify-email?token={token}"
        )
        subject = "Verifikasi Email Kamu - IPB Internship Portal"
        body_html = f"""
            <p style=\"margin:0 0 12px 0;\">Klik tombol di bawah untuk memverifikasi email kamu.</p>
            <p style=\"margin:0;color:#6b7280;font-size:13px;line-height:1.5;\">
                Link verifikasi berlaku selama <strong>24 jam</strong>.
            </p>
            <p style=\"margin:12px 0 0 0;color:#9ca3af;font-size:12px;word-break:break-all;\">
                Jika tombol tidak berfungsi, copy link ini:<br>{escape(verify_url)}
            </p>
        """
        html = self._build_email_layout(
            title="Verifikasi Email Kamu",
            recipient_name=user.full_name,
            body_html=body_html,
            accent_color="#1f7a4d",
            cta_label="Verifikasi Email",
            cta_url=verify_url,
        )
        send_status = await self._send(user.email, user.full_name, subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="EMAIL_VERIFICATION"
        )

    async def send_hr_pending_notification(self, user: User, company_name: str, uow: IUnitOfWork) -> None:
        subject = "Registrasi Kamu Sedang Diproses"
        body_html = f"""
            <p style=\"margin:0 0 12px 0;\">
                Registrasi HR kamu untuk perusahaan <strong>{escape(company_name)}</strong>
                sedang dalam tahap <strong>verifikasi admin</strong>.
            </p>
            <p style=\"margin:0;color:#6b7280;\">
                Estimasi proses: <strong>1-3 hari kerja</strong>. Kami akan mengirimkan update lewat email.
            </p>
        """
        html = self._build_email_layout(
            title="Registrasi Kamu Sedang Diproses",
            recipient_name=user.full_name,
            body_html=body_html,
            accent_color="#1f6feb",
        )
        send_status = await self._send(user.email, user.full_name, subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="HR_PENDING_NOTIFICATION"
        )

    async def send_admin_new_hr_notification(self, user: User, company: Company, uow: IUnitOfWork) -> None:
        admin_url = f"{settings.BACKEND_URL}{settings.API_V1_STR}/admin/pending-registrations"
        subject = f"Registrasi HR Baru - {company.company_name}"
        body_html = f"""
            <p style=\"margin:0 0 14px 0;\">Ada registrasi HR baru yang menunggu review admin.</p>
            <table style=\"width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;\">
                <tr>
                    <td style=\"padding:10px 12px;background:#f9fafb;color:#6b7280;width:38%;\">Nama</td>
                    <td style=\"padding:10px 12px;\"><strong>{escape(user.full_name)}</strong></td>
                </tr>
                <tr>
                    <td style=\"padding:10px 12px;background:#f9fafb;color:#6b7280;\">Email</td>
                    <td style=\"padding:10px 12px;\">{escape(user.email)}</td>
                </tr>
                <tr>
                    <td style=\"padding:10px 12px;background:#f9fafb;color:#6b7280;\">Perusahaan</td>
                    <td style=\"padding:10px 12px;\"><strong>{escape(company.company_name)}</strong></td>
                </tr>
                <tr>
                    <td style=\"padding:10px 12px;background:#f9fafb;color:#6b7280;\">Industri</td>
                    <td style=\"padding:10px 12px;\">{escape(company.industry or '-')}</td>
                </tr>
            </table>
        """
        html = self._build_email_layout(
            title="Ada Registrasi HR Baru",
            recipient_name="Admin IPB",
            body_html=body_html,
            accent_color="#c2410c",
            cta_label="Review Sekarang",
            cta_url=admin_url,
        )
        send_status = await self._send(settings.ADMIN_EMAIL, "Admin IPB", subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="ADMIN_HR_NOTIFICATION"
        )

    async def send_hr_approval_email(self, user: User, company_name: str, uow: IUnitOfWork) -> None:
        login_url = f"{settings.BASE_URL}/auth/login"
        subject = "Registrasi Kamu Telah Disetujui"
        body_html = f"""
            <p style=\"margin:0 0 12px 0;\">
                Akun HR dan data perusahaan <strong>{escape(company_name)}</strong>
                telah <strong>diverifikasi</strong>.
            </p>
            <p style=\"margin:0;color:#6b7280;\">Kamu sudah bisa login dan mulai menggunakan portal.</p>
        """
        html = self._build_email_layout(
            title="Registrasi Kamu Disetujui",
            recipient_name=user.full_name,
            body_html=body_html,
            accent_color="#1f7a4d",
            cta_label="Login Sekarang",
            cta_url=login_url,
        )
        send_status = await self._send(user.email, user.full_name, subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="HR_APPROVAL"
        )

    async def send_application_status_update(
        self,
        student_user: User,
        internship_title: str,
        company_name: str,
        new_status: str,
        application_id: str,
        uow: IUnitOfWork,
    ) -> None:
        """
        Notifies a student that their application status has changed.
        The accent color reflects the nature of the update:
          - Green  → Diterima / Accepted / Ditawarkan
          - Red    → Ditolak / Rejected
          - Blue   → everything else (in-progress)
        """
        _green = {"Diterima", "Accepted", "Ditawarkan"}
        _red   = {"Ditolak", "Rejected"}
        if new_status in _green:
            accent = "#1f7a4d"
            badge_bg = "#dcfce7"
            badge_color = "#166534"
        elif new_status in _red:
            accent = "#c2410c"
            badge_bg = "#fee2e2"
            badge_color = "#991b1b"
        else:
            accent = "#1f6feb"
            badge_bg = "#dbeafe"
            badge_color = "#1e40af"

        app_url = f"{settings.FRONTEND_URL}/student/applications/{application_id}"

        subject = f"Update Status Lamaran – {internship_title}"
        body_html = f"""
            <p style="margin:0 0 14px 0;">
                Status lamaran kamu untuk posisi <strong>{escape(internship_title)}</strong>
                di <strong>{escape(company_name)}</strong> telah diperbarui.
            </p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;
                        padding:16px 18px;margin:0 0 16px 0;">
                <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">Status terbaru</div>
                <span style="display:inline-block;background:{badge_bg};color:{badge_color};
                             font-weight:700;font-size:14px;padding:5px 14px;border-radius:20px;
                             letter-spacing:0.3px;">
                    {escape(new_status)}
                </span>
            </div>
            <p style="margin:0;color:#6b7280;font-size:13px;">
                Kamu bisa melihat riwayat lengkap perubahan status lamaran di halaman detail lamaran.
            </p>
        """
        html = self._build_email_layout(
            title="Status Lamaran Diperbarui",
            recipient_name=student_user.full_name,
            body_html=body_html,
            accent_color=accent,
            cta_label="Lihat Detail Lamaran",
            cta_url=app_url,
        )
        send_status = await self._send(student_user.email, student_user.full_name, subject, html)
        await self._save_notification(
            uow,
            student_user.id,
            subject,
            html,
            send_status,
            ref_id=application_id,
            ref_type="APPLICATION_STATUS_UPDATE",
        )

    async def send_hr_rejection_email(self, user: User, reason: str, uow: IUnitOfWork) -> None:
        subject = "Registrasi Kamu Ditolak"
        body_html = f"""
            <p style=\"margin:0 0 12px 0;\">Mohon maaf, registrasi HR kamu belum dapat disetujui.</p>
            <div style=\"background:#fff7ed;border:1px solid #fdba74;border-left:4px solid #ea580c;border-radius:8px;padding:12px 14px;margin:0 0 12px 0;\">
                <div style=\"font-weight:600;margin-bottom:6px;\">Alasan</div>
                <div style=\"color:#374151;\">{escape(reason)}</div>
            </div>
            <p style=\"margin:0;color:#6b7280;\">
                Jika ada pertanyaan, hubungi admin di
                <a href=\"mailto:{escape(settings.ADMIN_EMAIL)}\" style=\"color:#1f6feb;text-decoration:none;\">{escape(settings.ADMIN_EMAIL)}</a>.
            </p>
        """
        html = self._build_email_layout(
            title="Registrasi Kamu Belum Disetujui",
            recipient_name=user.full_name,
            body_html=body_html,
            accent_color="#c2410c",
        )
        send_status = await self._send(user.email, user.full_name, subject, html)
        await self._save_notification(
            uow, user.id, subject, html, send_status,
            ref_id=str(user.id), ref_type="HR_REJECTION"
        )

    def _build_email_layout(
        self,
        title: str,
        recipient_name: str,
        body_html: str,
        accent_color: str,
        cta_label: Optional[str] = None,
        cta_url: Optional[str] = None,
    ) -> str:
        cta_html = ""
        if cta_label and cta_url:
            cta_html = f"""
                <div style=\"margin-top:20px;\">
                    <a href=\"{escape(cta_url)}\"
                       style=\"display:inline-block;background:{accent_color};color:#ffffff;padding:11px 18px;
                              text-decoration:none;border-radius:8px;font-weight:600;\">
                        {escape(cta_label)}
                    </a>
                </div>
            """

        return f"""
        <div style=\"margin:0;padding:24px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;\">
            <div style=\"max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;\">
                <div style=\"background:{accent_color};padding:14px 20px;color:#ffffff;font-size:15px;font-weight:600;\">
                    IPB Internship Portal
                </div>
                <div style=\"padding:22px 20px;line-height:1.6;\">
                    <h2 style=\"margin:0 0 10px 0;font-size:20px;color:#111827;\">{escape(title)}</h2>
                    <p style=\"margin:0 0 16px 0;color:#374151;\">Halo <strong>{escape(recipient_name)}</strong>,</p>
                    {body_html}
                    {cta_html}
                </div>
                <div style=\"padding:12px 20px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;\">
                    Email ini dikirim otomatis oleh IPB Internship Portal. Mohon tidak membalas email ini.
                </div>
            </div>
        </div>
        """

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
