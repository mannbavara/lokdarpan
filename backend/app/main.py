import logging
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 ensures SQLModel registers relationships
from app.config import settings
from app.routers.api import api_router


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


# Get root logger
root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)

# Create file handler
file_handler = logging.FileHandler("backend_debug.log")
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))

# Add handler if not already present
if not any(isinstance(h, logging.FileHandler) for h in root_logger.handlers):
    root_logger.addHandler(file_handler)

logger = logging.getLogger(__name__)

if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    """Modern lifespan context manager replacing on_event decorators."""
    from sqlmodel import Session

    from app.core.scheduler import start_scheduler
    from app.database import engine, init_db

    # Initialize DB (create default org, superuser, system roles)
    with Session(engine) as session:
        init_db(session)

    start_scheduler()
    logger.info("Application started with APScheduler and DB initialized")

    yield

    # Shutdown background scheduler
    from app.core.scheduler import shutdown_scheduler

    shutdown_scheduler()
    logger.info("Application shutdown complete")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan,
)

# Set all CORS enabled origins
# Always add CORS middleware - in local/dev, allow the frontend host
cors_origins = settings.all_cors_origins if settings.all_cors_origins else [settings.FRONTEND_HOST]
print(f"🔧 CORS Configuration: Allowing origins: {cors_origins}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
