def calculate_priority(
    severity: str,
    confidence: float,
) -> str:
    """
    Convert AI severity into a municipal operational priority.
    """

    if severity == "high" and confidence >= 0.90:
        return "critical"

    if severity == "high":
        return "high"

    if severity == "medium" and confidence >= 0.85:
        return "medium"

    return "low"