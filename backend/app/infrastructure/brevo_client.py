import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


class BrevoClient:

    async def send(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        html_content: str,
    ) -> bool:
        headers = {
            "Content-Type": "application/json",
            "api-key": settings.BREVO_API_KEY,
        }
        payload = {
            "sender": {
                "name": settings.BREVO_SENDER_NAME,
                "email": settings.BREVO_SENDER_EMAIL,
            },
            "to": [{"email": to_email, "name": to_name}],
            "subject": subject,
            "htmlContent": html_content,
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(BREVO_API_URL, json=payload, headers=headers)
                if resp.status_code in (200, 201):
                    logger.info("Brevo: email terkirim ke %s", to_email)
                    return True
                else:
                    logger.error(
                        "Brevo: gagal kirim email ke %s — HTTP %s — %s",
                        to_email, resp.status_code, resp.text[:300]
                    )
                    return False
        except Exception as exc:
            logger.error("BrevoClient.send failed: %s", exc)
            return False
