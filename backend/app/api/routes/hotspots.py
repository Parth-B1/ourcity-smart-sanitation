from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.hotspot import HotspotResponse
from app.services.hotspot_service import generate_hotspots


router = APIRouter(
    prefix="/hotspots",
    tags=["Hotspots"],
)


@router.get(
    "/",
    response_model=list[HotspotResponse],
)
def get_hotspots(
    db: Session = Depends(get_db),
):
    return generate_hotspots(db)