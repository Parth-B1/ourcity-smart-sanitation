from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.database import get_db
from app.db.models import CollectionEvent, Report


router = APIRouter(
    prefix="/trucks",
    tags=["Trucks"],
)


class CollectionCompleteRequest(BaseModel):
    latitude: float
    longitude: float


@router.post("/collection-complete")
def collection_complete(
    data: CollectionCompleteRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("truck_operator")
    ),
):
    """
    Complete collection at a hotspot.

    1. Find active reports near the hotspot.
    2. Mark those reports as resolved.
    3. Create a permanent collection event.
    """

    radius = 0.01

    reports = (
        db.query(Report)
        .filter(
            Report.latitude.isnot(None),
            Report.longitude.isnot(None),
            Report.status != "resolved",
        )
        .all()
    )

    nearby_reports = []

    for report in reports:

        lat_distance = (
            report.latitude - data.latitude
        )

        lon_distance = (
            report.longitude - data.longitude
        )

        distance = (
            lat_distance ** 2
            + lon_distance ** 2
        ) ** 0.5

        if distance <= radius:
            nearby_reports.append(report)

    if not nearby_reports:
        raise HTTPException(
            status_code=404,
            detail=(
                "No active reports found "
                "at this collection location"
            ),
        )

    # Mark reports as resolved
    for report in nearby_reports:
        report.status = "resolved"

    # Create permanent collection event
    event = CollectionEvent(
        truck_id=str(
            current_user.get("id", "unknown")
        ),
        latitude=data.latitude,
        longitude=data.longitude,
        reports_resolved=len(nearby_reports),
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return {
        "success": True,
        "message": "Collection completed successfully",
        "collection_event": {
            "id": event.id,
            "truck_id": event.truck_id,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "reports_resolved": event.reports_resolved,
            "completed_at": event.completed_at,
        },
    }