from datetime import datetime

from sqlalchemy import DateTime, func
from sqlmodel import Field, SQLModel


class TimestampMixin(SQLModel):
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True), sa_column_kwargs={"server_default": func.now(), "nullable": False}
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={
            "server_default": func.now(),
            "onupdate": func.now(),
            "nullable": False,
        },
    )
    deleted_at: datetime | None = Field(
        default=None, sa_type=DateTime(timezone=True), sa_column_kwargs={"nullable": True, "index": True}
    )
