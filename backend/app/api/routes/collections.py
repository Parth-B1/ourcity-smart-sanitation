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

@router.get("/approaching")
def get_approaching_collection(
    latitude: float,
    longitude: float,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("citizen")
    ),
):
    """
    Return the next collection stop near
    the citizen's location.
    """

    from app.services.route_service import generate_route

    route = generate_route(
        db=db,
        truck_latitude=latitude,
        truck_longitude=longitude,
    )

    if not route["stops"]:
        return {
            "approaching": False,
            "truck_id": None,
            "estimated_minutes": None,
            "latitude": None,
            "longitude": None,
        }

    next_stop = route["stops"][0]

    return {
        "approaching": True,
        "truck_id": "truck104",
        "estimated_minutes": (
            next_stop["travel_time_minutes"]
        ),
        "latitude": next_stop["latitude"],
        "longitude": next_stop["longitude"],
    }