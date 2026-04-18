from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt
import passlib.handlers.bcrypt
from passlib.context import CryptContext

from app.config import settings

# Fix for passlib compatibility with bcrypt >= 4.0.0
passlib.handlers.bcrypt._bcrypt = bcrypt
if not hasattr(bcrypt, "__about__"):

    class About:
        __version__ = bcrypt.__version__

    bcrypt.__about__ = About()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
