import uuid

from sqlmodel import Session, select

from app.models import User
from app.models.user import UserCreate, UserUpdate
from app.utils.security import get_password_hash, verify_password

# ---------------------------
#   USER CRUD
# ---------------------------


def create_user(*, session: Session, user_create: UserCreate) -> User:
    user_data = user_create.model_dump(exclude={"password"})
    db_obj = User(**user_data, hashed_password=get_password_hash(user_create.password))
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate):
    user_data = user_in.model_dump(exclude_unset=True)
    extra = {}

    if "password" in user_data:
        extra["hashed_password"] = get_password_hash(user_data.pop("password"))

    # db_user.sqlmodel_update(user_data, update=extra)
    for field, value in user_data.items():
        setattr(db_user, field, value)
    for field, value in extra.items():
        setattr(db_user, field, value)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(session=session, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_user(*, session: Session, user_id: uuid.UUID) -> User | None:
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).first()


def get_users(*, session: Session, skip: int = 0, limit: int = 100):
    statement = select(User).offset(skip).limit(limit)
    return session.exec(statement).all()


def delete_user(*, session: Session, user_id: uuid.UUID) -> bool:
    user = get_user(session=session, user_id=user_id)
    if not user:
        return False
    session.delete(user)
    session.commit()
    return True
