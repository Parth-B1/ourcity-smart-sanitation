from fastapi import APIRouter
from app.api.routes.admin import router as admin_router
from app.api.routes.auth import router as auth_router
from app.api.routes.reports import router as reports_router
from app.api.routes.hotspots import router as hotspots_router
from app.api.routes.routes import router as routes_router
from app.api.routes.truck import router as trucks_router
from app.api.routes.collections import router as collections_router

api_router = APIRouter(
    prefix="/api",
)


api_router.include_router(
    auth_router,
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

api_router.include_router(
    admin_router,
)

api_router.include_router(
    trucks_router,
)

api_router.include_router(
    collections_router,
)

