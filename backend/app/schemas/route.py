from pydantic import BaseModel


class TruckLocation(BaseModel):
    latitude: float
    longitude: float


class RouteStop(BaseModel):
    stop_number: int
    latitude: float
    longitude: float
    priority: str
    report_count: int
    high_priority_reports: int
    distance_from_previous_km: float
    travel_time_minutes: int


class RouteResponse(BaseModel):
    truck: TruckLocation
    total_distance_km: float
    estimated_time_minutes: int
    route_coordinates: list[list[float]]
    stops: list[RouteStop]