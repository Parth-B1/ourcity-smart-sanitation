from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.security import require_role
from app.db.database import get_db
from app.db.models import Report


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
    Mark reports belonging to the selected
    collection hotspot as resolved.

    Only authenticated truck operators
    can call this endpoint.
    """

    # Same hotspot radius currently used by
    # hotspot_service.py.
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
            detail="No active reports found at this collection location",
        )

    for report in nearby_reports:
        report.status = "resolved"

    db.commit()

    return {
        "success": True,
        "message": "Collection completed successfully",
        "truck_id": current_user.get("id"),
        "reports_resolved": len(nearby_reports),
        "latitude": data.latitude,
        "longitude": data.longitude,
    }