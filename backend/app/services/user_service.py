import uuid

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models.user import User, UserUpdate
from app.utils.security import get_password_hash


def get_user(*, session: Session, user_id: uuid.UUID) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def get_users(
    *,
    session: Session,
    org_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
    is_active: bool | None = None,
    search: str | None = None,
) -> list[User]:
    statement = select(User).where(User.org_id == org_id)

    if is_active is not None:
        statement = statement.where(User.is_active == is_active)

    if search:
        # Simple case-insensitive search on name or email
        statement = statement.where((User.full_name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%")))

    statement = statement.offset(skip).limit(limit)
    return session.exec(statement).all()


def update_user(*, session: Session, user_id: uuid.UUID, user_in: UserUpdate) -> User:
    db_user = get_user(session=session, user_id=user_id)

    user_data = user_in.model_dump(exclude_unset=True)
    if "password" in user_data:
        password = user_data.pop("password")
        db_user.hashed_password = get_password_hash(password)

    for key, value in user_data.items():
        setattr(db_user, key, value)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
