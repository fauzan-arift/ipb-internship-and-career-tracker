"""
Infrastructure models — import all ORM models for Alembic discovery.
"""
from app.infrastructure.models.user import UserORM
from app.infrastructure.models.student import StudentORM
from app.infrastructure.models.hr import HrORM
from app.infrastructure.models.admin import AdminORM
from app.infrastructure.models.company import CompanyORM
from app.infrastructure.models.document import DocumentORM
from app.infrastructure.models.email_notification import EmailNotificationORM
from app.infrastructure.models.verification_token import VerificationTokenORM

__all__ = [
    "UserORM", "StudentORM", "HrORM", "AdminORM",
    "CompanyORM", "DocumentORM", "EmailNotificationORM", "VerificationTokenORM",
]
