from math import sqrt
from urllib.parse import quote
from urllib.request import Request, urlopen
import json

from sqlalchemy.orm import Session

from app.services.hotspot_service import generate_hotspots


OSRM_BASE_URL = "https://router.project-osrm.org"


def calculate_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """
    Calculate approximate straight-line distance between
    two geographic coordinates.

    Used only as a fallback if road routing is unavailable.

    Returns distance in kilometers.
    """

    lat_km = (lat2 - lat1) * 111

    lon_km = (
        (lon2 - lon1)
        * 111
        * 0.93
    )

    return sqrt(
        lat_km**2
        + lon_km**2
    )


def estimate_travel_time(
    distance_km: float,
    average_speed_kmh: float = 25,
) -> int:
    """
    Estimate travel time in minutes.

    Used as a fallback when road-routing data
    is unavailable.
    """

    if distance_km <= 0:
        return 0

    hours = distance_km / average_speed_kmh

    return round(hours * 60)


def get_road_route(
    coordinates: list[list[float]],
):
    """
    Get an actual road-following route from OSRM.

    Input coordinates use:
        [latitude, longitude]

    OSRM expects:
        longitude,latitude

    Returns:
        route coordinates in [latitude, longitude] format,
        total distance in km,
        total duration in minutes,
        leg information.

    Returns None if the routing service cannot be reached
    or cannot calculate a route.
    """

    if len(coordinates) < 2:
        return None

    try:
        osrm_coordinates = ";".join(
            f"{longitude},{latitude}"
            for latitude, longitude in coordinates
        )

        url = (
            f"{OSRM_BASE_URL}"
            f"/route/v1/driving/"
            f"{quote(osrm_coordinates, safe=';,')}"
            f"?overview=full"
            f"&geometries=geojson"
            f"&steps=false"
        )

        request = Request(
            url,
            headers={
                "User-Agent": (
                    "OurCity-Smart-Sanitation/1.0"
                )
            },
        )

        with urlopen(
            request,
            timeout=10,
        ) as response:
            data = json.loads(
                response.read().decode("utf-8")
            )

        if data.get("code") != "Ok":
            return None

        routes = data.get("routes", [])

        if not routes:
            return None

        route = routes[0]

        geometry = route.get("geometry", {})

        geometry_coordinates = geometry.get(
            "coordinates",
            [],
        )

        if not geometry_coordinates:
            return None

        # OSRM returns [longitude, latitude].
        # Leaflet expects [latitude, longitude].
        leaflet_coordinates = [
            [
                coordinate[1],
                coordinate[0],
            ]
            for coordinate in geometry_coordinates
        ]

        legs = route.get("legs", [])

        leg_data = []

        for leg in legs:
            leg_data.append(
                {
                    "distance_km": round(
                        leg.get("distance", 0) / 1000,
                        2,
                    ),
                    "duration_minutes": round(
                        leg.get("duration", 0) / 60
                    ),
                }
            )

        return {
            "route_coordinates": leaflet_coordinates,
            "total_distance_km": round(
                route.get("distance", 0) / 1000,
                2,
            ),
            "estimated_time_minutes": round(
                route.get("duration", 0) / 60
            ),
            "legs": leg_data,
        }

    except Exception as error:
        print(
            f"Road routing unavailable: {error}"
        )

        return None


def generate_fallback_route(
    coordinates: list[list[float]],
):
    """
    Generate a straight-line fallback route.

    This keeps the application functional if OSRM
    is temporarily unavailable.
    """

    total_distance = 0.0
    legs = []

    for index in range(1, len(coordinates)):
        previous = coordinates[index - 1]
        current = coordinates[index]

        distance_km = calculate_distance(
            previous[0],
            previous[1],
            current[0],
            current[1],
        )

        total_distance += distance_km

        legs.append(
            {
                "distance_km": round(
                    distance_km,
                    2,
                ),
                "duration_minutes": estimate_travel_time(
                    distance_km,
                ),
            }
        )

    return {
        "route_coordinates": coordinates,
        "total_distance_km": round(
            total_distance,
            2,
        ),
        "estimated_time_minutes": estimate_travel_time(
            total_distance,
        ),
        "legs": legs,
    }


def generate_route(
    db: Session,
    truck_latitude: float,
    truck_longitude: float,
):
    """
    Generate a priority-aware waste collection route.

    Route process:

    1. Find current waste hotspots.
    2. Prioritize high-severity hotspots.
    3. Use report density as secondary priority.
    4. Build ordered truck/stop coordinates.
    5. Request actual road geometry from OSRM.
    6. Fall back to straight-line geometry if OSRM
       is unavailable.
    """

    hotspots = generate_hotspots(db)

    # --------------------------------------------------
    # No hotspots
    # --------------------------------------------------

    if not hotspots:
        return {
            "truck": {
                "latitude": truck_latitude,
                "longitude": truck_longitude,
            },
            "total_distance_km": 0,
            "estimated_time_minutes": 0,
            "route_coordinates": [
                [
                    truck_latitude,
                    truck_longitude,
                ]
            ],
            "stops": [],
        }

    # --------------------------------------------------
    # Priority ranking
    # --------------------------------------------------

    priority_order = {
        "critical": 0,
        "high": 1,
        "medium": 2,
        "low": 3,
    }

    hotspots.sort(
        key=lambda hotspot: (
            priority_order.get(
                hotspot["priority"],
                4,
            ),
            -hotspot["report_count"],
            -hotspot["high_priority_reports"],
        )
    )

    # --------------------------------------------------
    # Build waypoint list
    # --------------------------------------------------

    waypoints = [
        [
            truck_latitude,
            truck_longitude,
        ]
    ]

    for hotspot in hotspots:
        waypoints.append(
            [
                hotspot["latitude"],
                hotspot["longitude"],
            ]
        )

    # --------------------------------------------------
    # Get actual road route
    # --------------------------------------------------

    road_route = get_road_route(
        waypoints
    )

    # --------------------------------------------------
    # Fallback if OSRM unavailable
    # --------------------------------------------------

    if road_route is None:
        road_route = generate_fallback_route(
            waypoints
        )

    route_coordinates = road_route[
        "route_coordinates"
    ]

    total_distance = road_route[
        "total_distance_km"
    ]

    total_time = road_route[
        "estimated_time_minutes"
    ]

    legs = road_route["legs"]

    # --------------------------------------------------
    # Build stops
    # --------------------------------------------------

    stops = []

    for index, hotspot in enumerate(
        hotspots,
        start=1,
    ):
        # Each hotspot corresponds to a route leg:
        #
        # leg 0 = truck → hotspot 1
        # leg 1 = hotspot 1 → hotspot 2
        # etc.

        leg_index = index - 1

        if leg_index < len(legs):
            leg = legs[leg_index]

            distance_km = leg[
                "distance_km"
            ]

            travel_minutes = leg[
                "duration_minutes"
            ]

        else:
            # Defensive fallback
            previous = waypoints[index - 1]
            current = waypoints[index]

            distance_km = calculate_distance(
                previous[0],
                previous[1],
                current[0],
                current[1],
            )

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
                "high_priority_reports": (
                    hotspot[
                        "high_priority_reports"
                    ]
                ),
                "distance_from_previous_km": round(
                    distance_km,
                    2,
                ),
                "travel_time_minutes": (
                    travel_minutes
                ),
            }
        )

    # --------------------------------------------------
    # Final response
    # --------------------------------------------------

    return {
        "truck": {
            "latitude": truck_latitude,
            "longitude": truck_longitude,
        },
        "total_distance_km": total_distance,
        "estimated_time_minutes": total_time,
        "route_coordinates": route_coordinates,
        "stops": stops,
    }