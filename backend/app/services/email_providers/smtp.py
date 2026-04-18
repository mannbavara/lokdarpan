"""SMTP email provider implementation."""

import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

from .base import EmailProvider

logger = logging.getLogger(__name__)


class SMTPProvider(EmailProvider):
    """SMTP email service provider (works with Gmail, Outlook, etc.)."""

    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_user)
        self.use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"

    def send_email(self, to: str, subject: str, body: str, cc: str | None = None, html: bool = False) -> dict[str, Any]:
        """Send email via SMTP."""
        try:
            # Create message
            msg = MIMEMultipart("alternative")
            msg["From"] = self.from_email
            msg["To"] = to
            msg["Subject"] = subject

            if cc:
                msg["Cc"] = cc

            # Attach body
            mime_type = "html" if html else "plain"
            msg.attach(MIMEText(body, mime_type))

            # Connect to SMTP server
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()

                if self.smtp_user and self.smtp_password:
                    server.login(self.smtp_user, self.smtp_password)

                # Send email
                recipients = [to]
                if cc:
                    recipients.extend([email.strip() for email in cc.split(",")])

                server.send_message(msg)

                logger.info(f"[SMTP] Email sent successfully to {to}")
                return {
                    "success": True,
                    "message_id": msg["Message-ID"] if "Message-ID" in msg else None,
                    "message": "Email sent successfully via SMTP",
                }

        except smtplib.SMTPException as e:
            error_msg = f"SMTP error: {str(e)}"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}
        except Exception as e:
            error_msg = f"Unexpected error sending email via SMTP: {str(e)}"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}

    def get_provider_name(self) -> str:
        return "SMTP"
