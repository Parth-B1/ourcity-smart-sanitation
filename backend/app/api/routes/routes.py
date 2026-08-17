from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.route import RouteResponse
from app.services.route_service import generate_route


router = APIRouter(
    prefix="/routes",
    tags=["Routes"],
)


@router.get(
    "/optimize",
    response_model=RouteResponse,
)
def optimize_route(
    latitude: float,
    longitude: float,
    db: Session = Depends(get_db),
):
    return generate_route(
        db=db,
        truck_latitude=latitude,
        truck_longitude=longitude,
    )