from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Report
from app.schemas.report import ReportCreate, ReportResponse

from app.services.ai_service import analyze_report
from app.services.priority_service import calculate_priority


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.post(
    "/",
    response_model=ReportResponse,
    status_code=201,
)
def create_report(
    report_data: ReportCreate,
    db: Session = Depends(get_db),
):
    analysis = analyze_report(
        category=report_data.category,
        description=report_data.description,
    )

    priority = calculate_priority(
        severity=analysis.severity,
        confidence=analysis.confidence,
    )

    report = Report(
        report_code="TEMP",
        category=report_data.category,
        description=report_data.description,
        location=report_data.location,
        latitude=report_data.latitude,
        longitude=report_data.longitude,
        status="submitted",
        priority=priority,
        ai_category=analysis.category,
        ai_confidence=analysis.confidence,
        ai_severity=analysis.severity,
        ai_reasoning=analysis.reasoning,
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