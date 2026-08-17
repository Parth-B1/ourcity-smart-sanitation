from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    UserResponse,
)
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import (
    create_access_token,
    get_current_user,
)
from app.services.auth_service import (
    authenticate_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(
    credentials: LoginRequest,
):
    """
    Authenticate a user and return a JWT.
    """

    user = authenticate_user(
        credentials.username,
        credentials.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    access_token = create_access_token(
        {
            "sub": user["id"],
            "username": user["username"],
            "role": user["role"],
        }
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            username=user["username"],
            name=user["name"],
            role=user["role"],
            truck_id=user["truck_id"],
        ),
    )
@router.get("/me")
def get_me(
    current_user: dict = Depends(get_current_user),
):
    return {
        "authenticated": True,
        "user": current_user,
    }