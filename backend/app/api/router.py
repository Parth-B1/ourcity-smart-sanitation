from fastapi import APIRouter

from app.api.routes.reports import router as reports_router
from app.api.routes.hotspots import router as hotspots_router
from app.api.routes.routes import router as routes_router


api_router = APIRouter(
    prefix="/api",
)


api_router.include_router(
    reports_router,
)

api_router.include_router(
    hotspots_router,
)

api_router.include_router(
    routes_router,
)