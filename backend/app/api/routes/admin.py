from fastapi import APIRouter, Depends

from app.core.security import require_role


router = APIRouter(
    prefix="/admin",
    tags=["Authorization Test"],
)


@router.get("/nmc-test")
def nmc_test(
    current_user: dict = Depends(
        require_role("nmc_officer")
    ),
):
    return {
        "message": "NMC access granted",
        "user": current_user,
    }


@router.get("/truck-test")
def truck_test(
    current_user: dict = Depends(
        require_role("truck_operator")
    ),
):
    return {
        "message": "Truck operator access granted",
        "user": current_user,
    }


@router.get("/citizen-test")
def citizen_test(
    current_user: dict = Depends(
        require_role("citizen")
    ),
):
    return {
        "message": "Citizen access granted",
        "user": current_user,
    }