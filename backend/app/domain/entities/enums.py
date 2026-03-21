from enum import Enum


class UserRole(str, Enum):
    STUDENT = "STUDENT"
    HR = "HR"
    ADMIN = "ADMIN"


class UserStatus(str, Enum):
    UNVERIFIED = "UNVERIFIED"
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class CompanyVerificationStatus(str, Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class DocumentType(str, Enum):
    CV = "CV"
    NPWP = "NPWP"
    OTHER = "OTHER"


class EmailNotificationStatus(str, Enum):
    SENT = "SENT"
    FAILED = "FAILED"


class TokenType(str, Enum):
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
    PASSWORD_RESET = "PASSWORD_RESET"
