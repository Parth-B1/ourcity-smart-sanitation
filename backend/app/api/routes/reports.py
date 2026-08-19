from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Report
from app.schemas.report import ReportResponse

from app.services.ai_service import analyze_report
from app.services.priority_service import calculate_priority

UPLOAD_DIR = Path(
    "uploads/reports"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.post(
    "/",
    response_model=ReportResponse,
    status_code=201,
)
@router.post(
    "/",
    response_model=ReportResponse,
    status_code=201,
)
async def create_report(
    category: str = Form(...),
    description: str | None = Form(None),
    location: str = Form(...),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    image_url = None

    if image:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, PNG and WEBP images are allowed",
            )

        extension = Path(
            image.filename or ""
        ).suffix.lower()

        if not extension:
            extension = ".jpg"

        filename = (
            f"{uuid4().hex}{extension}"
        )

        file_path = (
            UPLOAD_DIR / filename
        )

        contents = await image.read()

        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image must be smaller than 5 MB",
            )

        file_path.write_bytes(contents)

        image_url = (
            f"/uploads/reports/{filename}"
        )

    analysis = analyze_report(
        category=category,
        description=description or "",
    )

    priority = calculate_priority(
        severity=analysis.severity,
        confidence=analysis.confidence,
    )

    report = Report(
        report_code="TEMP",
        category=category,
        description=description,
        location=location,
        latitude=latitude,
        longitude=longitude,
        status="submitted",
        priority=priority,
        ai_category=analysis.category,
        ai_confidence=analysis.confidence,
        ai_severity=analysis.severity,
        ai_reasoning=analysis.reasoning,
        image_url=image_url,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    report.report_code = (
        f"OS-{report.created_at.year}-{report.id:05d}"
    )

    db.commit()
    db.refresh(report)

    return report


@router.get(
    "/",
    response_model=list[ReportResponse],
)
def get_reports(
    db: Session = Depends(get_db),
):
    return (
        db.query(Report)
        .order_by(Report.created_at.desc())
        .all()
    )


@router.get(
    "/{report_id}",
    response_model=ReportResponse,
)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return report