"""Service layer for email template and complaint email management."""

import uuid
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.models.complaint import (
    Complaint,
    ComplaintEmail,
    ComplaintStatus,
    EmailTemplate,
)
from app.services import email_service


def get_email_templates(
    *, session: Session, org_id: uuid.UUID, status_trigger: ComplaintStatus | None = None, is_active: bool = True
) -> list[EmailTemplate]:
    """Get email templates for an organization, optionally filtered by status trigger."""
    statement = select(EmailTemplate).where(EmailTemplate.org_id == org_id, EmailTemplate.is_active == is_active)

    if status_trigger:
        statement = statement.where(EmailTemplate.status_trigger == status_trigger)

    return list(session.exec(statement).all())


def get_email_template(*, session: Session, template_id: uuid.UUID, org_id: uuid.UUID) -> EmailTemplate | None:
    """Get a specific email template."""
    statement = select(EmailTemplate).where(EmailTemplate.id == template_id, EmailTemplate.org_id == org_id)
    return session.exec(statement).first()


def create_email_template(
    *,
    session: Session,
    org_id: uuid.UUID,
    name: str,
    status_trigger: ComplaintStatus,
    subject: str,
    body: str,
    signature: str,
    description: str | None = None,
    is_active: bool = True,
) -> EmailTemplate:
    """Create a new email template."""
    template = EmailTemplate(
        org_id=org_id,
        name=name,
        status_trigger=status_trigger,
        subject=subject,
        body=body,
        signature=signature,
        description=description,
        is_active=is_active,
    )

    session.add(template)
    session.commit()
    session.refresh(template)

    return template


def send_complaint_email(
    *,
    session: Session,
    complaint: Complaint,
    sent_to: str,
    subject: str,
    body: str,
    sent_by: uuid.UUID,
    cc: str | None = None,
    template_id: uuid.UUID | None = None,
) -> tuple[ComplaintEmail, dict]:
    """
    Send an email for a complaint and log it in the database.

    Returns:
        tuple: (ComplaintEmail record, Mailgun API response)
    """
    # Send email via Mailgun
    email_result = email_service.send_email(to=sent_to, subject=subject, body=body, cc=cc, html=False)

    # Log email in database regardless of send success
    complaint_email = ComplaintEmail(
        complaint_id=complaint.id,
        template_id=template_id,
        sent_to=sent_to,
        cc=cc,
        subject=subject,
        body=body,
        sent_at=datetime.now(timezone.utc).isoformat(),
        sent_by=sent_by,
    )

    session.add(complaint_email)
    session.commit()
    session.refresh(complaint_email)

    return complaint_email, email_result


def get_complaint_emails(*, session: Session, complaint_id: uuid.UUID) -> list[ComplaintEmail]:
    """Get all emails sent for a complaint."""
    statement = (
        select(ComplaintEmail)
        .where(ComplaintEmail.complaint_id == complaint_id)
        .order_by(ComplaintEmail.sent_at.desc())
    )

    return list(session.exec(statement).all())
