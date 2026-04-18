"""
GET /landing/featured-representatives
Public endpoint — no authentication required.
Returns featured politicians with their latest trending issues (max 3 each).
"""

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.database import engine
from app.models.politician import Politician, PoliticianTrendingIssue

router = APIRouter(prefix="/landing", tags=["landing"])


# ─────────────────────────────────────────────
# Pydantic response schemas
# ─────────────────────────────────────────────


class TrendingIssueSchema(BaseModel):
    """Schema for a single trending issue mapped to a politician."""

    id: uuid.UUID
    issue_label: str
    source_url: str | None = None
    mapped_at: datetime

    model_config = {"from_attributes": True}


class FeaturedRepresentativeSchema(BaseModel):
    """Schema for one card on the landing page."""

    politician_id: uuid.UUID
    name: str
    photo_url: str | None = None
    party: str | None = None
    constituency: str | None = None
    designation: str | None = None
    years_in_office: int = 0
    trending_issues: list[TrendingIssueSchema] = []

    model_config = {"from_attributes": True}


class FeaturedRepresentativesResponse(BaseModel):
    data: list[FeaturedRepresentativeSchema]
    count: int


# ─────────────────────────────────────────────
# DB dependency
# ─────────────────────────────────────────────


def get_session():
    with Session(engine) as session:
        yield session


# ─────────────────────────────────────────────
# Endpoint
# ─────────────────────────────────────────────


@router.get("/featured-representatives", response_model=FeaturedRepresentativesResponse)
def get_featured_representatives(session: Session = Depends(get_session)) -> FeaturedRepresentativesResponse:
    """
    Return all politicians flagged is_featured=true, each with their
    latest 3 trending issues embedded.

    Uses selectinload to fetch all issues in ONE extra query — no N+1.
    The latest-3 slice is done in Python after the eager load.
    """
    statement = (
        select(Politician)
        .where(Politician.is_featured == True)  # noqa: E712
        .options(selectinload(Politician.trending_issues))  # type: ignore[arg-type]
        .order_by(Politician.name)
    )
    politicians = session.exec(statement).all()

    if not politicians:
        return FeaturedRepresentativesResponse(data=[], count=0)

    results: list[FeaturedRepresentativeSchema] = []
    for pol in politicians:
        # Sort by mapped_at DESC and take latest 3
        sorted_issues = sorted(pol.trending_issues, key=lambda i: i.mapped_at, reverse=True)[:3]

        results.append(
            FeaturedRepresentativeSchema(
                politician_id=pol.id,
                name=pol.name,
                photo_url=pol.photo_url,
                party=pol.party,
                constituency=pol.constituency,
                designation=pol.designation,
                years_in_office=pol.years_in_office,
                trending_issues=[TrendingIssueSchema.model_validate(issue) for issue in sorted_issues],
            )
        )

    return FeaturedRepresentativesResponse(data=results, count=len(results))
