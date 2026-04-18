import uuid

from pydantic import EmailStr
from sqlalchemy import Column, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlmodel import Field, Relationship, SQLModel

from .base import TimestampMixin


class Organization(TimestampMixin, table=True):
    """Tenant record — every resource belongs to one org."""

    __tablename__ = "organizations"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, sa_column_kwargs={"server_default": text("gen_random_uuid()")}
    )
    name: str = Field(max_length=255, nullable=False)
    slug: str = Field(max_length=100, unique=True, index=True, nullable=False)
    plan: str = Field(default="free", max_length=50)  # free|starter|pro|enterprise
    settings: dict = Field(default={}, sa_type=JSONB)
    is_active: bool = Field(default=True)

    users: list["User"] = Relationship(back_populates="organization")


class User(TimestampMixin, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, sa_column_kwargs={"server_default": text("gen_random_uuid()")}
    )
    org_id: uuid.UUID = Field(foreign_key="organizations.id", nullable=False, index=True)
    email: str = Field(max_length=320, unique=True, index=True, nullable=False)
    hashed_password: str = Field(sa_type=Text, nullable=False)
    full_name: str = Field(max_length=255, nullable=False)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    department: str | None = Field(default=None, max_length=100)
    job_title: str | None = Field(default=None, max_length=100)
    preferences: dict = Field(default={}, sa_type=JSONB)

    # Backward compatibility and admin support
    is_superuser: bool = Field(default=False)

    # Relationships
    organization: Organization | None = Relationship(back_populates="users")


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_tokens"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, sa_column_kwargs={"server_default": text("gen_random_uuid()")}
    )
    # ondelete must be on ForeignKey, not on Field/Column directly
    user_id: uuid.UUID = Field(
        sa_column=Column(
            PGUUID(as_uuid=True),
            ForeignKey("users.id", ondelete="CASCADE"),
            index=True,
            nullable=False,
        )
    )
    token_hash: str = Field(max_length=128, unique=True, nullable=False)
    expires_at: str = Field(nullable=False)
    revoked: bool = Field(default=False)



# Schemas
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    department: str | None = Field(default=None, max_length=100)
    job_title: str | None = Field(default=None, max_length=100)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)
    org_id: uuid.UUID | None = None


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int
