"""Email provider factory and configuration."""

import logging
import os

from .base import EmailProvider
from .mailgun import MailgunProvider
from .smtp import SMTPProvider

logger = logging.getLogger(__name__)


class EmailProviderFactory:
    """Factory for creating email provider instances based on configuration."""

    _instance: EmailProvider | None = None

    @classmethod
    def get_provider(cls) -> EmailProvider:
        """
        Get the configured email provider instance (singleton).

        Provider is determined by EMAIL_PROVIDER environment variable:
        - 'mailgun' (default): Use Mailgun API
        - 'smtp': Use SMTP (Gmail, Outlook, etc.)
        - 'sendgrid': Use SendGrid API (future)
        - 'ses': Use AWS SES (future)

        Returns:
            EmailProvider: Configured email provider instance
        """
        if cls._instance is None:
            provider_name = os.getenv("EMAIL_PROVIDER", "mailgun").lower()

            if provider_name == "mailgun":
                cls._instance = MailgunProvider()
            elif provider_name == "smtp":
                cls._instance = SMTPProvider()
            # Future providers can be added here:
            # elif provider_name == 'sendgrid':
            #     cls._instance = SendGridProvider()
            # elif provider_name == 'ses':
            #     cls._instance = AWSProvider()
            else:
                logger.warning(f"Unknown email provider '{provider_name}', defaulting to Mailgun")
                cls._instance = MailgunProvider()

            logger.info(f"✉️ Email provider initialized: {cls._instance.get_provider_name()}")

        return cls._instance

    @classmethod
    def reset_provider(cls):
        """Reset the provider instance (useful for testing)."""
        cls._instance = None


# Convenience function for sending emails
def send_email(to: str, subject: str, body: str, cc: str | None = None, html: bool = False) -> dict:
    """
    Send an email using the configured provider.

    Args:
        to: Recipient email address
        subject: Email subject
        body: Email body (text or HTML)
        cc: Optional comma-separated CC email addresses
        html: If True, body is treated as HTML, otherwise plain text

    Returns:
        dict: Response with 'success' boolean and 'message_id' or 'error'
    """
    provider = EmailProviderFactory.get_provider()
    return provider.send_email(to, subject, body, cc, html)


def format_email_body(template_body: str, template_signature: str, **kwargs) -> str:
    """
    Format email body with template variables.

    Args:
        template_body: Email body template with {variable} placeholders
        template_signature: Email signature template
        **kwargs: Variables to replace in template

    Returns:
        str: Formatted email body with signature
    """
    try:
        # Replace variables in body
        formatted_body = template_body.format(**kwargs)
        formatted_signature = template_signature.format(**kwargs)

        # Combine body and signature
        return f"{formatted_body}\n\n{formatted_signature}"
    except KeyError as e:
        logger.warning(f"Missing template variable: {e}")
        # Return template as-is if variable missing
        return f"{template_body}\n\n{template_signature}"
