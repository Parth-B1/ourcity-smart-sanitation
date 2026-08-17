from math import sqrt

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.database import get_db
from app.db.models import CollectionEvent


router = APIRouter(
    prefix="/collections",
    tags=["Collections"],
)


@router.get("/nearby")
def get_nearby_collection(
    latitude: float,
    longitude: float,
    radius: float = 0.01,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("citizen")
    ),
):
    """
    Find the latest collection event
    near the citizen's location.
    """

    events = (
        db.query(CollectionEvent)
        .order_by(
            CollectionEvent.completed_at.desc()
        )
        .all()
    )

    nearby_events = []

    for event in events:

        lat_distance = (
            event.latitude - latitude
        )

        lon_distance = (
            event.longitude - longitude
        )

        distance = sqrt(
            lat_distance ** 2
            + lon_distance ** 2
        )

        if distance <= radius:
            nearby_events.append(event)

    if not nearby_events:
        return {
            "collection_completed": False,
            "event": None,
        }

    event = nearby_events[0]

    return {
        "collection_completed": True,
        "event": {
            "id": event.id,
            "truck_id": event.truck_id,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "reports_resolved": event.reports_resolved,
            "completed_at": event.completed_at,
        },
    }