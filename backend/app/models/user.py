"""
ORM Models - User + Profile Pattern
Refactored: User (auth) + Student/Company/Admin (profiles)
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Union
from app.db.database import Base
from app.domain.entities.user import User as BaseUser, Student, Company, Admin, UserRole


class UserORM(Base):
    """
    Core User Table - Authentication & Authorization only
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships (1:1 dengan profiles)
    student = relationship("StudentORM", back_populates="user", uselist=False, cascade="all, delete-orphan")
    company = relationship("CompanyORM", back_populates="user", uselist=False, cascade="all, delete-orphan")
    admin = relationship("AdminORM", back_populates="user", uselist=False, cascade="all, delete-orphan")


class StudentORM(Base):
    """Student Profile - Data mahasiswa"""
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    nim = Column(String, unique=True, nullable=False, index=True)
    major = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("UserORM", back_populates="student")


class CompanyORM(Base):
    """Company Profile - Data perusahaan"""
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    company_address = Column(String, nullable=False)
    company_phone = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("UserORM", back_populates="company")


class AdminORM(Base):
    """Admin Profile - Data admin (opsional, bisa dikembangkan)"""
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("UserORM", back_populates="admin")


# ============== MAPPER FUNCTIONS ==============

def user_orm_to_domain(user_orm: UserORM) -> Union[Student, Company, Admin]:
    """
    Convert User ORM (with profile) to appropriate Domain model
    Returns: Student, Company, or Admin instance based on profile
    """
    # Base user data
    base_data = {
        "id": user_orm.id,
        "email": user_orm.email,
        "full_name": user_orm.full_name,
        "hashed_password": user_orm.hashed_password,
        "is_active": user_orm.is_active,
        "is_verified": user_orm.is_verified,
        "created_at": user_orm.created_at,
        "updated_at": user_orm.updated_at
    }
    
    # Return appropriate domain model based on profile
    if user_orm.student:
        return Student(
            **base_data,
            nim=user_orm.student.nim,
            major=user_orm.student.major
        )
    elif user_orm.company:
        return Company(
            **base_data,
            company_name=user_orm.company.company_name,
            company_address=user_orm.company.company_address,
            company_phone=user_orm.company.company_phone
        )
    elif user_orm.admin:
        return Admin(**base_data)
    
    raise ValueError("User has no profile")


def user_domain_to_orm(user_domain: Union[Student, Company, Admin]) -> tuple:
    """
    Convert Domain model to User ORM + Profile ORM
    Returns: (UserORM, ProfileORM)
    """
    # Create base user ORM (no role column - role determined by profile)
    user_orm = UserORM(
        id=user_domain.id,
        email=user_domain.email,
        full_name=user_domain.full_name,
        hashed_password=user_domain.hashed_password,
        is_active=user_domain.is_active,
        is_verified=user_domain.is_verified,
        created_at=user_domain.created_at,
        updated_at=user_domain.updated_at
    )
    
    # Create profile ORM based on type
    if isinstance(user_domain, Student):
        profile_orm = StudentORM(
            nim=user_domain.nim,
            major=user_domain.major
        )
    elif isinstance(user_domain, Company):
        profile_orm = CompanyORM(
            company_name=user_domain.company_name,
            company_address=user_domain.company_address,
            company_phone=user_domain.company_phone
        )
    elif isinstance(user_domain, Admin):
        profile_orm = AdminORM()
    else:
        raise ValueError(f"Unknown user domain type: {type(user_domain)}")
    
    return user_orm, profile_orm


User = UserORM