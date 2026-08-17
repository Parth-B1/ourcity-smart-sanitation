from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from app.core.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    JWT_ALGORITHM,
    JWT_SECRET_KEY,
)


password_hash = PasswordHash.recommended()

bearer_scheme = HTTPBearer()


# --------------------------------------------------
# Password hashing
# --------------------------------------------------

def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


# --------------------------------------------------
# JWT creation
# --------------------------------------------------

def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:

    payload = data.copy()

    if expires_delta is None:
        expires_delta = timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    expire = (
        datetime.now(timezone.utc)
        + expires_delta
    )

    payload["exp"] = expire

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


# --------------------------------------------------
# JWT decoding
# --------------------------------------------------

def decode_access_token(
    token: str,
) -> dict[str, Any] | None:

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

        return payload

    except InvalidTokenError:
        return None


# --------------------------------------------------
# Current user
# --------------------------------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
) -> dict[str, Any]:

    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    user_id = payload.get("sub")
    username = payload.get("username")
    role = payload.get("role")

    if not user_id or not username or not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    return {
        "id": user_id,
        "username": username,
        "role": role,
    }


# --------------------------------------------------
# Role authorization
# --------------------------------------------------

def require_role(*allowed_roles: str):

    def role_checker(
        current_user: dict[str, Any] = Depends(
            get_current_user
        ),
    ) -> dict[str, Any]:

        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )

        return current_user

    return role_checker