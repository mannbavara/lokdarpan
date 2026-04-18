"""Email service using configurable email providers.

This module provides a simple interface for sending emails.
The actual email provider (Mailgun, SMTP, SendGrid, etc.) is configured
via the EMAIL_PROVIDER environment variable.

To change providers, simply update your .env file:
    EMAIL_PROVIDER=mailgun  # Use Mailgun (default)
    EMAIL_PROVIDER=smtp     # Use SMTP (Gmail, Outlook, etc.)

Each provider has its own configuration variables. See email_providers/ for details.
"""

# Re-export from email_providers for backward compatibility
from app.services.email_providers import format_email_body, send_email

__all__ = ["send_email", "format_email_body"]
