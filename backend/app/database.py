from sqlmodel import Session, create_engine, select

from app.config import settings
from app.models import Organization, User
from app.utils.security import get_password_hash

# print("DB URL USED:", settings.sqlalchemy_database_uri)

# Configure connection pool with timeout settings
engine = create_engine(
    str(settings.sqlalchemy_database_uri),
    # Connection pool settings
    pool_size=10,  # Number of connections to maintain in the pool
    max_overflow=20,  # Maximum number of connections to create beyond pool_size
    pool_pre_ping=True,  # Verify connections before using them (reconnects if stale)
    pool_recycle=3600,  # Recycle connections after 1 hour (3600 seconds)
    # Connection timeout settings
    connect_args={
        "connect_timeout": 10,  # Timeout for establishing connection (seconds)
        "options": "-c statement_timeout=30000",  # 30 second statement timeout (milliseconds)
    },
    # Echo SQL queries (set to True for debugging, False for production)
    echo=True,
)


# make sure allSQLModel modelsare imported  before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models
    # are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    # Create default organization if not exists
    org = session.exec(select(Organization).where(Organization.slug == "default")).first()
    if not org:
        org = Organization(
            name="Default Organization",
            slug="default",
            plan="enterprise",  # Superuser org
            is_active=True,
        )
        session.add(org)
        session.commit()
        session.refresh(org)

    user = session.exec(select(User).where(User.email == settings.FIRST_SUPERUSER)).first()
    if not user:
        user = User(
            email=settings.FIRST_SUPERUSER,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            full_name="Super Admin",
            is_superuser=True,
            is_active=True,
            is_verified=True,
            org_id=org.id,
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    # Role system pruned
