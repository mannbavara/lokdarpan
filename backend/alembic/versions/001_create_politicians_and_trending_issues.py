"""Create politicians and politician_trending_issues tables

Revision ID: 001
Revises:
Create Date: 2026-04-18

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = "000"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ------------------------------------------------------------------ #
    # politicians
    # ------------------------------------------------------------------ #
    op.create_table(
        "politicians",
        sa.Column(
            "id",
            sa.UUID(),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("photo_url", sa.String(length=500), nullable=True),
        sa.Column("party", sa.String(length=100), nullable=True),
        sa.Column("constituency", sa.String(length=255), nullable=True),
        sa.Column("designation", sa.String(length=100), nullable=True),
        sa.Column("years_in_office", sa.Integer(), nullable=True, server_default="0"),
        sa.Column(
            "is_featured", sa.Boolean(), nullable=False, server_default="false"
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_politicians_id"), "politicians", ["id"], unique=False)

    # ------------------------------------------------------------------ #
    # politician_trending_issues
    # ------------------------------------------------------------------ #
    op.create_table(
        "politician_trending_issues",
        sa.Column(
            "id",
            sa.UUID(),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("politician_id", sa.UUID(), nullable=False),
        sa.Column("issue_label", sa.String(length=100), nullable=False),
        sa.Column("source_url", sa.String(length=500), nullable=True),
        sa.Column(
            "mapped_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["politician_id"],
            ["politicians.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_politician_trending_issues_politician_id"),
        "politician_trending_issues",
        ["politician_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_politician_trending_issues_politician_id"),
        table_name="politician_trending_issues",
    )
    op.drop_table("politician_trending_issues")
    op.drop_index(op.f("ix_politicians_id"), table_name="politicians")
    op.drop_table("politicians")
