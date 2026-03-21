from pydantic_settings import BaseSettings
from typing import List, Optional, Union
from pydantic import field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "IPB Internship & Career Tracker"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    JWT_EXPIRE_DAYS: int = 7
    DATABASE_URL: str
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v

    BACKEND_URL: str = "http://localhost:8000"
    BASE_URL: str = "http://localhost:5173"
    FRONTEND_URL: str = "http://localhost:5173"
    BREVO_API_KEY: str
    BREVO_SENDER_EMAIL: str = "noreply@ipb.ac.id"
    BREVO_SENDER_NAME: str = "IPB Internship Tracker"
    ADMIN_EMAIL: str = "admin@ipb.ac.id"
    ADMIN_PASSWORD: str
    ADMIN_FULL_NAME: str = "IPB Admin"
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 5
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
