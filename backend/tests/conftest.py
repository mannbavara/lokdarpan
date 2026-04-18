from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

# Fix for JSONB in SQLite
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.compiler import compiles
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.dependencies import get_db
from app.main import app
from app.models import Organization, User
from app.utils.security import create_access_token, get_password_hash


@compiles(JSONB, "sqlite")
def compile_jsonb_sqlite(type_, compiler, **kw):
    return "JSON"


# Use in-memory SQLite for tests
# StaticPool is important for in-memory SQLite with multiple threads/connections
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@pytest.fixture(name="session")
def session_fixture() -> Generator[Session, None, None]:
    import json

    def jsonb_exists(json_str, value):
        if not json_str:
            return False
        try:
            data = json.loads(json_str)
            if isinstance(data, list):
                return value in data
            return data == value
        except json.JSONDecodeError:
            return False

    from sqlalchemy import event

    @event.listens_for(engine, "connect")
    def connect(dbapi_connection, connection_record):
        dbapi_connection.create_function("jsonb_exists", 2, jsonb_exists)

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="client")
def client_fixture(session: Session) -> Generator[TestClient, None, None]:
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture(name="test_org")
def test_org_fixture(session: Session) -> Organization:
    org = Organization(name="Test Org", slug="test-org", plan="enterprise")
    session.add(org)
    session.commit()
    session.refresh(org)
    return org


@pytest.fixture(name="test_user")
def test_user_fixture(session: Session, test_org: Organization) -> User:
    user = User(
        email="test@example.com",
        full_name="Test User",
        hashed_password=get_password_hash("password"),
        is_active=True,
        is_superuser=True,
        org_id=test_org.id,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="token_headers")
def token_headers_fixture(test_user: User) -> dict:
    from datetime import timedelta

    access_token = create_access_token(test_user.id, expires_delta=timedelta(minutes=30))
    return {"Authorization": f"Bearer {access_token}"}
