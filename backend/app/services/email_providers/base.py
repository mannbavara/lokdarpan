"""Abstract base class for email providers."""

from abc import ABC, abstractmethod
from typing import Any


class EmailProvider(ABC):
    """Abstract base class for email service providers."""

    @abstractmethod
    def send_email(self, to: str, subject: str, body: str, cc: str | None = None, html: bool = False) -> dict[str, Any]:
        """
        Send an email.

        Args:
            to: Recipient email address
            subject: Email subject
            body: Email body (text or HTML)
            cc: Optional comma-separated CC email addresses
            html: If True, body is treated as HTML, otherwise plain text

        Returns:
            dict: Response with 'success' boolean and 'message_id' or 'error'
        """
        pass

    @abstractmethod
    def get_provider_name(self) -> str:
        """Return the name of the email provider."""
        pass
