from dataclasses import dataclass


@dataclass
class AIAnalysis:
    category: str
    confidence: float
    severity: str
    reasoning: str


def analyze_report(
    category: str,
    description: str | None = None,
) -> AIAnalysis:
    """
    Temporary AI intelligence layer.

    Later this function can call a real AI/vision model.
    """

    text = f"{category} {description or ''}".lower()

    high_risk_keywords = [
        "overflow",
        "overflowing",
        "dump",
        "dumping",
        "burning",
        "hospital",
        "school",
        "road",
        "sewage",
        "dead animal",
    ]

    medium_risk_keywords = [
        "plastic",
        "garbage",
        "waste",
        "litter",
        "bin",
        "trash",
    ]

    high_matches = [
        keyword
        for keyword in high_risk_keywords
        if keyword in text
    ]

    medium_matches = [
        keyword
        for keyword in medium_risk_keywords
        if keyword in text
    ]

    if high_matches:
        severity = "high"
        confidence = 0.94
        reasoning = (
            "The report contains indicators of a potentially urgent "
            "sanitation issue."
        )

    elif medium_matches:
        severity = "medium"
        confidence = 0.88
        reasoning = (
            "The report indicates a sanitation issue requiring "
            "municipal attention."
        )

    else:
        severity = "low"
        confidence = 0.76
        reasoning = (
            "The report does not contain strong indicators of an "
            "urgent sanitation problem."
        )

    return AIAnalysis(
        category=category,
        confidence=confidence,
        severity=severity,
        reasoning=reasoning,
    )