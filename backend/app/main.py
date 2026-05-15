from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.infrastructure.cloudinary import configure_cloudinary

from app.presentation.api.auth import router as auth_router
from app.presentation.api.admin import router as admin_router
from app.presentation.api.internship import router as internship_router
from app.presentation.api.hr_internship import router as hr_internship_router
from app.presentation.api.document_router import router as document_router
from app.presentation.api.student_router import router as student_router
from app.presentation.api.hr_router import router as hr_profile_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.CLOUDINARY_CLOUD_NAME:
        configure_cloudinary()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="IPB Internship & Career Tracker API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(admin_router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])
app.include_router(internship_router, prefix=f"{settings.API_V1_STR}/internships", tags=["Internships"])
app.include_router(hr_internship_router, prefix=f"{settings.API_V1_STR}/hr/internships", tags=["HR - Internships"])
app.include_router(document_router, prefix=f"{settings.API_V1_STR}/documents", tags=["Documents"])
app.include_router(student_router, prefix=f"{settings.API_V1_STR}/students", tags=["Students"])
app.include_router(hr_profile_router, prefix=f"{settings.API_V1_STR}/hr", tags=["HR - Profile"])


@app.get("/", tags=["default"])
def root():
    return {"message": "IPB Internship & Career Tracker API", "version": settings.VERSION}
