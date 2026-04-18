from fastapi import APIRouter

from app.routers import (
    landing,
    login,
    users,
)

api_router = APIRouter()

api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(landing.router)

