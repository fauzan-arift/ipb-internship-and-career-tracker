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
    PROFILE_PHOTO = "PROFILE_PHOTO"
    OTHER = "OTHER"


class EmailNotificationStatus(str, Enum):
    SENT = "SENT"
    FAILED = "FAILED"


class TokenType(str, Enum):
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
    PASSWORD_RESET = "PASSWORD_RESET"


class WorkStatus(str, Enum):
    WFO = "WFO"
    WFA = "WFA"
    HYBRID = "Hybrid"


class PaymentStatus(str, Enum):
    PAID = "Paid"
    UNPAID = "Unpaid"


class ApplicationStatus(str, Enum):
    PENDING = "Pending"
    REVIEWED = "Reviewed"
    INTERVIEW = "Interview"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"
    # HR workflow statuses
    DIPROSES = "Diproses"
    REVIEW_HR = "Review HR"
    DITOLAK = "Ditolak"
    DITERIMA = "Diterima"
    DITAWARKAN = "Ditawarkan"


class OfferStatus(str, Enum):
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"
