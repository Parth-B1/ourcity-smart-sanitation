from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReportCreate(BaseModel):
    category: str
    description: str | None = None
    location: str
    latitude: float | None = None
    longitude: float | None = None


class ReportResponse(BaseModel):
    id: int
    report_code: str
    category: str
    description: str | None
    location: str
    latitude: float | None
    longitude: float | None

    status: str
    priority: str

    ai_category: str | None
    ai_confidence: float | None
    ai_severity: str | None
    ai_reasoning: str | None

    image_url: str | None

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )