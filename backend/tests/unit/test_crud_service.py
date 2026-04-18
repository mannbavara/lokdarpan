from sqlmodel import Session

from app.models.user import UserCreate, UserUpdate
from app.services import crud
from app.utils.security import verify_password


def test_create_user(session: Session, test_org):
    """Test creating a new user."""
    user_in = UserCreate(
        email="newuser@example.com", password="testpassword123", full_name="New User", org_id=test_org.id
    )

    user = crud.create_user(session=session, user_create=user_in)

    assert user.email == "newuser@example.com"
    assert user.full_name == "New User"
    assert user.org_id == test_org.id
    assert verify_password("testpassword123", user.hashed_password)
    assert user.id is not None


def test_get_user_by_email(session: Session, test_user):
    """Test retrieving user by email."""
    user = crud.get_user_by_email(session=session, email=test_user.email)

    assert user is not None
    assert user.email == test_user.email
    assert user.id == test_user.id


def test_get_user_by_email_not_found(session: Session):
    """Test retrieving non-existent user by email."""
    user = crud.get_user_by_email(session=session, email="nonexistent@example.com")

    assert user is None


def test_authenticate_success(session: Session, test_user):
    """Test successful authentication."""
    user = crud.authenticate(session=session, email="test@example.com", password="password")

    assert user is not None
    assert user.email == test_user.email


def test_authenticate_wrong_password(session: Session, test_user):
    """Test authentication with wrong password."""
    user = crud.authenticate(session=session, email="test@example.com", password="wrongpassword")

    assert user is None


def test_authenticate_nonexistent_user(session: Session):
    """Test authentication with non-existent user."""
    user = crud.authenticate(session=session, email="nonexistent@example.com", password="password")

    assert user is None


def test_update_user(session: Session, test_user):
    """Test updating user information."""
    user_update = UserUpdate(full_name="Updated Name")

    updated_user = crud.update_user(session=session, db_user=test_user, user_in=user_update)

    assert updated_user.full_name == "Updated Name"
    assert updated_user.email == test_user.email  # Email unchanged


def test_update_user_password(session: Session, test_user):
    """Test updating user password."""
    user_update = UserUpdate(password="newpassword123")

    updated_user = crud.update_user(session=session, db_user=test_user, user_in=user_update)

    # Verify new password works
    assert verify_password("newpassword123", updated_user.hashed_password)
    # Verify old password doesn't work
    assert not verify_password("password", updated_user.hashed_password)
