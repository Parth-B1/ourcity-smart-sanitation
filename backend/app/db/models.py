from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from app.db.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    report_code = Column(
        String(30),
        unique=True,
        index=True,
        nullable=False,
    )

    category = Column(
        String(100),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    location = Column(
        String(255),
        nullable=False,
    )

    latitude = Column(
        Float,
        nullable=True,
    )

    longitude = Column(
        Float,
        nullable=True,
    )

    status = Column(
        String(30),
        default="submitted",
        nullable=False,
    )

    priority = Column(
        String(20),
        default="medium",
        nullable=False,
    )

    ai_category = Column(
        String(100),
        nullable=True,
    )

    ai_confidence = Column(
        Float,
        nullable=True,
    )

    ai_severity = Column(
        String(20),
        nullable=True,
    )

    ai_reasoning = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )