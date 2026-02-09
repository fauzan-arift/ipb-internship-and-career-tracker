"""
Domain Entity - User (Refactored to User + Profile pattern)
Pure Python classes untuk business logic, tidak bergantung pada framework
"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    """User roles enum"""
    ADMIN = "admin"
    STUDENT = "student"
    COMPANY = "company"


@dataclass
class User:
    """
    Base User Domain Model - Authentication & Core info only
    """
    id: Optional[int]
    email: str
    full_name: str
    hashed_password: str
    is_active: bool = True
    is_verified: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def __post_init__(self):
        """Validasi setelah inisialisasi"""
        self.validate()
    
    def validate(self):
        """Business rules validation"""
        if not self.email or '@' not in self.email:
            raise ValueError("Invalid email format")
    
    def activate(self):
        """Activate user account"""
        self.is_active = True
    
    def deactivate(self):
        """Deactivate user account"""
        self.is_active = False
    
    def verify(self):
        """Verify user account"""
        self.is_verified = True


@dataclass
class Student(User):
    """Student Domain Model with profile data"""
    nim: Optional[str] = None
    major: Optional[str] = None
    
    @property
    def role(self) -> UserRole:
        return UserRole.STUDENT
    
    def __post_init__(self):
        """Validasi student"""
        super().__post_init__()
        self._validate_student()
    
    def _validate_student(self):
        """Student-specific validation"""
        if not self.nim:
            raise ValueError("Student must have NIM")
        if not self.major:
            raise ValueError("Student must have major")
        self._validate_nim()
    
    def _validate_nim(self):
        """Validasi format NIM IPB (1 huruf + 10 digit, contoh: G6401231040)"""
        if len(self.nim) != 11:
            raise ValueError("NIM must be exactly 11 characters")
        if not self.nim[0].isalpha():
            raise ValueError("NIM must start with a letter")
        if not self.nim[1:].isdigit():
            raise ValueError("NIM format must be 1 letter + 10 digits (e.g., G6401231040)")
    
    def can_apply_for_internship(self) -> bool:
        """Business logic: Check if student can apply for internship"""
        return self.is_active and self.is_verified
    
    def get_display_name(self) -> str:
        return f"{self.full_name} ({self.nim})"


@dataclass
class Company(User):
    """Company Domain Model with profile data"""
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_phone: Optional[str] = None
    
    @property
    def role(self) -> UserRole:
        return UserRole.COMPANY
    
    def __post_init__(self):
        """Validasi company"""
        super().__post_init__()
        self._validate_company()
    
    def _validate_company(self):
        """Company-specific validation"""
        if not self.company_name:
            raise ValueError("Company must have company name")
        if not self.company_address:
            raise ValueError("Company must have address")
        if not self.company_phone:
            raise ValueError("Company must have phone number")
        self._validate_company_phone()
    
    def _validate_company_phone(self):
        """Validasi phone number"""
        phone = self.company_phone.replace('-', '').replace(' ', '').replace('+', '')
        if not phone.isdigit():
            raise ValueError("Phone number must contain only digits")
        if len(phone) < 10:
            raise ValueError("Phone number must be at least 10 digits")
    
    def can_post_internship(self) -> bool:
        """Business logic: Check if company can post internship"""
        return self.is_active and self.is_verified
    
    def get_display_name(self) -> str:
        return self.company_name or self.full_name


@dataclass
class Admin(User):
    """Admin Domain Model"""
    
    @property
    def role(self) -> UserRole:
        return UserRole.ADMIN
    
    def is_admin(self) -> bool:
        return True
    
    def get_display_name(self) -> str:
        return self.full_name
