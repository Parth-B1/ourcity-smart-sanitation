from math import sqrt

from sqlalchemy.orm import Session

from app.db.models import Report


def distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """
    Approximate distance between two coordinates.

    This is sufficient for our first prototype.
    Later we can use PostGIS/geospatial queries.
    """

    lat_distance = lat1 - lat2
    lon_distance = lon1 - lon2

    return sqrt(
        lat_distance**2 +
        lon_distance**2
    )


def generate_hotspots(
    db: Session,
    radius: float = 0.01,
):
    """
    Group nearby reports into sanitation hotspots.
    """

    reports = (
        db.query(Report)
        .filter(
            Report.latitude.isnot(None),
            Report.longitude.isnot(None),
        )
        .all()
    )

    hotspots = []
    used_reports = set()

    for report in reports:

        if report.id in used_reports:
            continue

        nearby_reports = []

        for candidate in reports:

            if candidate.id in used_reports:
                continue

            if distance(
                report.latitude,
                report.longitude,
                candidate.latitude,
                candidate.longitude,
            ) <= radius:
                nearby_reports.append(candidate)

        if not nearby_reports:
            continue

        for item in nearby_reports:
            used_reports.add(item.id)

        report_count = len(nearby_reports)

        high_priority_count = sum(
            1
            for item in nearby_reports
            if item.priority in {"high", "critical"}
        )

        if high_priority_count >= 3 or report_count >= 10:
            priority = "high"

        elif high_priority_count >= 1 or report_count >= 5:
            priority = "medium"

        else:
            priority = "low"

        avg_latitude = sum(
            item.latitude
            for item in nearby_reports
        ) / report_count

        avg_longitude = sum(
            item.longitude
            for item in nearby_reports
        ) / report_count

        hotspots.append(
            {
                "latitude": avg_latitude,
                "longitude": avg_longitude,
                "report_count": report_count,
                "high_priority_reports": high_priority_count,
                "priority": priority,
            }
        )

    return hotspots