import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, func, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlmodel import Field, Relationship, SQLModel


class Politician(SQLModel, table=True):
    """A publicly elected representative tracked by Lokdarpan."""

    __tablename__ = "politicians"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")},
    )
    name: str = Field(max_length=255, nullable=False)
    photo_url: str | None = Field(default=None, max_length=500)
    party: str | None = Field(default=None, max_length=100)
    constituency: str | None = Field(default=None, max_length=255)
    designation: str | None = Field(default=None, max_length=100)
    years_in_office: int = Field(default=0)
    is_featured: bool = Field(default=False, nullable=False)

    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now(), "nullable": False},
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now(), "nullable": False},
    )

    # Relationship — one politician has many trending issues
    trending_issues: list["PoliticianTrendingIssue"] = Relationship(
        back_populates="politician",
    )


class PoliticianTrendingIssue(SQLModel, table=True):
    """A trending issue mapped to a specific politician."""

    __tablename__ = "politician_trending_issues"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")},
    )
    # Use sa_column so we can attach ondelete to ForeignKey (not Column)
    politician_id: uuid.UUID = Field(
        sa_column=Column(
            PGUUID(as_uuid=True),
            ForeignKey("politicians.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        )
    )
    issue_label: str = Field(max_length=100, nullable=False)
    source_url: str | None = Field(default=None, max_length=500)
    mapped_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now(), "nullable": False},
    )

    # Back-reference to the parent politician
    politician: Politician | None = Relationship(back_populates="trending_issues")
