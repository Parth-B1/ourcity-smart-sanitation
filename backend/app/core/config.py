import os

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "ourcity-hackathon-secret-change-before-production",
)

JWT_ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60