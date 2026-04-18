import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import CurrentUser, SessionDep, get_current_active_superuser
from app.models.user import UserPublic, UserUpdate, UserUpdateMe
from app.services import user_service
from app.utils.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> UserPublic:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=UserPublic)
def update_user_me(
    session: SessionDep,
    user_in: UserUpdateMe,
    current_user: CurrentUser,
) -> Any:
    """
    Update own profile.
    """
    if user_in.email:
        existing_user = user_service.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=409, detail="Email already in use")

    user_data = user_in.model_dump(exclude_unset=True)
    if "password" in user_data and user_data["password"]:
        password = user_data.pop("password")
        current_user.hashed_password = get_password_hash(password)

    for key, value in user_data.items():
        setattr(current_user, key, value)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.get("/", response_model=list[UserPublic], dependencies=[Depends(get_current_active_superuser)])
def read_users(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
    is_active: bool | None = None,
    search: str | None = None,
) -> Any:
    """
    Retrieve users.
    """
    return user_service.get_users(
        session=session,
        org_id=current_user.org_id,
        skip=skip,
        limit=limit,
        is_active=is_active,
        search=search,
    )


@router.get("/{user_id}", response_model=UserPublic, dependencies=[Depends(get_current_active_superuser)])
def read_user(
    user_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,  # noqa: ARG001
) -> Any:
    """
    Get user by ID.
    """
    return user_service.get_user(session=session, user_id=user_id)


@router.put("/{user_id}", response_model=UserPublic, dependencies=[Depends(get_current_active_superuser)])
def update_user(
    user_id: uuid.UUID,
    user_in: UserUpdate,
    session: SessionDep,
    current_user: CurrentUser,  # noqa: ARG001
) -> Any:
    """
    Update user.
    """
    return user_service.update_user(session=session, user_id=user_id, user_in=user_in)
