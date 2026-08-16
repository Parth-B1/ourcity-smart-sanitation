from math import sqrt

from sqlalchemy.orm import Session

from app.db.models import Report
from app.services.hotspot_service import generate_hotspots


def calculate_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """
    Approximate distance in kilometers.

    Good enough for our prototype.
    Later we can use a real road-routing service.
    """

    lat_km = (lat2 - lat1) * 111
    lon_km = (
        (lon2 - lon1)
        * 111
        * 0.93
    )

    return sqrt(
        lat_km**2 +
        lon_km**2
    )


def estimate_travel_time(
    distance_km: float,
    average_speed_kmh: float = 25,
) -> int:
    """
    Return estimated travel time in minutes.
    """

    if distance_km <= 0:
        return 0

    hours = distance_km / average_speed_kmh

    return round(hours * 60)


def generate_route(
    db: Session,
    truck_latitude: float,
    truck_longitude: float,
):
    """
    Generate a simple priority-aware collection route.
    """

    hotspots = generate_hotspots(db)

    if not hotspots:
        return {
            "truck": {
                "latitude": truck_latitude,
                "longitude": truck_longitude,
            },
            "total_distance_km": 0,
            "estimated_time_minutes": 0,
            "stops": [],
        }

    priority_order = {
        "high": 0,
        "medium": 1,
        "low": 2,
    }

    hotspots.sort(
        key=lambda hotspot: (
            priority_order.get(
                hotspot["priority"],
                3,
            ),
            -hotspot["report_count"],
        )
    )

    current_latitude = truck_latitude
    current_longitude = truck_longitude

    total_distance = 0
    stops = []

    for index, hotspot in enumerate(hotspots, start=1):

        distance_km = calculate_distance(
            current_latitude,
            current_longitude,
            hotspot["latitude"],
            hotspot["longitude"],
        )

        total_distance += distance_km

        travel_minutes = estimate_travel_time(
            distance_km,
        )

        stops.append(
            {
                "stop_number": index,
                "latitude": hotspot["latitude"],
                "longitude": hotspot["longitude"],
                "priority": hotspot["priority"],
                "report_count": hotspot["report_count"],
                "high_priority_reports": hotspot[
                    "high_priority_reports"
                ],
                "distance_from_previous_km": round(
                    distance_km,
                    2,
                ),
                "travel_time_minutes": travel_minutes,
            }
        )

        current_latitude = hotspot["latitude"]
        current_longitude = hotspot["longitude"]

    total_time = estimate_travel_time(
        total_distance,
    )

    return {
        "truck": {
            "latitude": truck_latitude,
            "longitude": truck_longitude,
        },
        "total_distance_km": round(
            total_distance,
            2,
        ),
        "estimated_time_minutes": total_time,
        "stops": stops,
    }