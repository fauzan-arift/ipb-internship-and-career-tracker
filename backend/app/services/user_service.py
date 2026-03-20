from typing import Optional, Union
from app.domain.entities.user import Student, Company, Admin
from app.models.user import UserORM, StudentORM, CompanyORM, AdminORM, user_orm_to_domain
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository


class UserService:
    """
    Service layer untuk User operations with domain validation
    Focuses on business logic orchestration
    """

    def __init__(self, repository: UserRepository):
        self.repo = repository
    
    def create_student(
        self,
        email: str,
        password: str,
        full_name: str,
        nim: str,
        major: str
    ) -> Student:
        """
        Create student with domain validation
        """
        # Domain validation - let domain model validate business rules
        student_domain = Student(
            id=None,
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password),
            nim=nim,
            major=major
        )

        # Create User ORM
        user_orm = UserORM(
            email=student_domain.email,
            full_name=student_domain.full_name,
            hashed_password=student_domain.hashed_password,
            is_active=student_domain.is_active,
            is_verified=student_domain.is_verified
        )
        user_orm = self.repo.create_user(user_orm)

        # Create Student Profile
        student_orm = StudentORM(
            user_id=user_orm.id,
            nim=student_domain.nim,
            major=student_domain.major
        )
        self.repo.create_student_profile(student_orm)
        self.repo.commit()
        self.repo.refresh(user_orm)

        return user_orm_to_domain(user_orm)
    
    def create_company(
        self,
        email: str,
        password: str,
        full_name: str,
        company_name: str,
        company_address: str,
        company_phone: str
    ) -> Company:
        """
        Create company with domain validation
        """
        # Domain validation
        company_domain = Company(
            id=None,
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password),
            company_name=company_name,
            company_address=company_address,
            company_phone=company_phone
        )

        # Create User ORM
        user_orm = UserORM(
            email=company_domain.email,
            full_name=company_domain.full_name,
            hashed_password=company_domain.hashed_password,
            is_active=company_domain.is_active,
            is_verified=company_domain.is_verified
        )
        user_orm = self.repo.create_user(user_orm)

        # Create Company Profile
        company_orm = CompanyORM(
            user_id=user_orm.id,
            company_name=company_domain.company_name,
            company_address=company_domain.company_address,
            company_phone=company_domain.company_phone
        )
        self.repo.create_company_profile(company_orm)
        self.repo.commit()
        self.repo.refresh(user_orm)

        return user_orm_to_domain(user_orm)
    
    def create_admin(
        self,
        email: str,
        password: str,
        full_name: str
    ) -> Admin:
        """
        Create admin user
        """
        # Domain validation
        admin_domain = Admin(
            id=None,
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password)
        )

        # Create User ORM
        user_orm = UserORM(
            email=admin_domain.email,
            full_name=admin_domain.full_name,
            hashed_password=admin_domain.hashed_password,
            is_active=admin_domain.is_active,
            is_verified=admin_domain.is_verified
        )
        user_orm = self.repo.create_user(user_orm)

        # Create Admin Profile
        admin_orm = AdminORM(user_id=user_orm.id)
        self.repo.create_admin_profile(admin_orm)
        self.repo.commit()
        self.repo.refresh(user_orm)

        return user_orm_to_domain(user_orm)
    
    def get_by_email(self, email: str) -> Optional[Union[Student, Company, Admin]]:
        """
        Get user by email with profile
        """
        user_orm = self.repo.get_by_email(email)
        if user_orm:
            return user_orm_to_domain(user_orm)
        return None
    
    def get_by_id(self, user_id: int) -> Optional[Union[Student, Company, Admin]]:
        """
        Get user by ID with profile
        """
        user_orm = self.repo.get_by_id(user_id)
        if user_orm:
            return user_orm_to_domain(user_orm)
        return None
    
    def activate_user(self, user_id: int) -> Union[Student, Company, Admin]:
        """Activate user using domain logic"""
        user_orm = self.repo.get_by_id(user_id)
        if not user_orm:
            raise ValueError("User not found")

        user_domain = user_orm_to_domain(user_orm)
        user_domain.activate()

        user_orm.is_active = user_domain.is_active
        self.repo.commit()
        self.repo.refresh(user_orm)

        return user_orm_to_domain(user_orm)
    
    def verify_user(self, user_id: int) -> Union[Student, Company, Admin]:
        """Verify user using domain logic"""
        user_orm = self.repo.get_by_id(user_id)
        if not user_orm:
            raise ValueError("User not found")

        user_domain = user_orm_to_domain(user_orm)
        user_domain.verify()

        user_orm.is_verified = user_domain.is_verified
        self.repo.commit()
        self.repo.refresh(user_orm)

        return user_orm_to_domain(user_orm)
