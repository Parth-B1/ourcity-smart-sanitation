from pydantic import BaseModel


class HotspotResponse(BaseModel):
    latitude: float
    longitude: float
    report_count: int
    high_priority_reports: int
    priority: str