from typing import Any

from app.core.security import (
    hash_password,
    verify_password,
)


DEMO_USERS: dict[str, dict[str, Any]] = {
    "citizen": {
        "id": "citizen-001",
        "username": "citizen",
        "name": "Citizen User",
        "role": "citizen",
        "truck_id": None,
        "password": "citizen123",
    },
    "nmc": {
        "id": "nmc-001",
        "username": "nmc",
        "name": "NMC Officer",
        "role": "nmc_officer",
        "truck_id": None,
        "password": "nmc123",
    },
    "truck104": {
        "id": "truck-104",
        "username": "truck104",
        "name": "Truck Operator 104",
        "role": "truck_operator",
        "truck_id": "TRUCK-104",
        "password": "truck123",
    },
}


# Hash demo passwords once when the application starts.
# This keeps plaintext passwords out of the authentication
# verification logic itself.
for user in DEMO_USERS.values():
    user["hashed_password"] = hash_password(
        user["password"]
    )

    del user["password"]


def get_user(
    username: str,
) -> dict[str, Any] | None:
    return DEMO_USERS.get(username)


def authenticate_user(
    username: str,
    password: str,
) -> dict[str, Any] | None:
    """
    Verify username and password.

    Returns the user if authentication succeeds.
    """

    user = get_user(username)

    if user is None:
        return None

    if not verify_password(
        password,
        user["hashed_password"],
    ):
        return None

    return user