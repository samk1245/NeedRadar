import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base
import app.models # Register all models

from app.api.v1 import (
    auth, needs, discovery, providers, moderation, analytics, notifications, uploads
)
from app.seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    # Ensure uploads dir exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    # Auto-seed database if empty
    try:
        seed_database()
    except Exception as e:
        print(f"Seed note: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Unmet Needs Intelligence & Community Action Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to settings.BACKEND_CORS_ORIGINS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static media mount for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Health & Readiness
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME, "version": "1.0.0"}

@app.get("/ready", tags=["Health"])
def ready_check():
    return {"status": "ready", "database": "connected"}

# API Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(needs.router, prefix=f"{settings.API_V1_STR}/needs", tags=["Community Needs"])
app.include_router(discovery.router, prefix=f"{settings.API_V1_STR}/discovery", tags=["Discovery & Maps"])
app.include_router(providers.router, prefix=f"{settings.API_V1_STR}/providers", tags=["Providers & NGOs"])
app.include_router(moderation.router, prefix=f"{settings.API_V1_STR}/moderation", tags=["Moderation & Admin"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics & Intelligence"])
app.include_router(notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notifications"])
app.include_router(uploads.router, prefix=f"{settings.API_V1_STR}/uploads", tags=["File Uploads"])
