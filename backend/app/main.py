from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="IPB Internship & Career Tracker API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "IPB Internship & Career Tracker API", "version": settings.VERSION}

@app.get("/health")
@app.get("/api/v1/health")
def health_check():
    """Health check endpoint for Docker"""
    return {"status": "healthy", "service": "IPB Internship Tracker API"}
