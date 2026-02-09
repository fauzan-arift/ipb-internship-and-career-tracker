from typing import Optional, Union
from sqlalchemy.orm import Session, joinedload
from app.domain.entities.user import Student, Company, Admin, UserRole
from app.models.user import UserORM, StudentORM, CompanyORM, AdminORM, user_orm_to_domain
from app.core.security import get_password_hash


class UserService:
    """
    Service layer untuk User operations with domain validation
    """
    
    def __init__(self, db: Session):
        self.db = db
    
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
        # Buat domain model 
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
        self.db.add(user_orm)
        self.db.flush()  # Get user_id
        
        # Create Student Profile
        student_orm = StudentORM(
            user_id=user_orm.id,
            nim=student_domain.nim,
            major=student_domain.major
        )
        self.db.add(student_orm)
        self.db.commit()
        self.db.refresh(user_orm)
        
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
        company_domain = Company(
            id=None,
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password),
            company_name=company_name,
            company_address=company_address,
            company_phone=company_phone
        )
        
        user_orm = UserORM(
            email=company_domain.email,
            full_name=company_domain.full_name,
            hashed_password=company_domain.hashed_password,
            is_active=company_domain.is_active,
            is_verified=company_domain.is_verified
        )
        self.db.add(user_orm)
        self.db.flush()
        
        company_orm = CompanyORM(
            user_id=user_orm.id,
            company_name=company_domain.company_name,
            company_address=company_domain.company_address,
            company_phone=company_domain.company_phone
        )
        self.db.add(company_orm)
        self.db.commit()
        self.db.refresh(user_orm)
        
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
        admin_domain = Admin(
            id=None,
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password)
        )
        
        user_orm = UserORM(
            email=admin_domain.email,
            full_name=admin_domain.full_name,
            hashed_password=admin_domain.hashed_password,
            is_active=admin_domain.is_active,
            is_verified=admin_domain.is_verified
        )
        self.db.add(user_orm)
        self.db.flush()
        
        admin_orm = AdminORM(user_id=user_orm.id)
        self.db.add(admin_orm)
        self.db.commit()
        self.db.refresh(user_orm)
        
        return user_orm_to_domain(user_orm)
    
    def get_by_email(self, email: str) -> Optional[Union[Student, Company, Admin]]:
        """
        Get user by email with profile (eager loading)
        """
        user_orm = (
            self.db.query(UserORM)
            .options(
                joinedload(UserORM.student),
                joinedload(UserORM.company),
                joinedload(UserORM.admin)
            )
            .filter(UserORM.email == email)
            .first()
        )
        if user_orm:
            return user_orm_to_domain(user_orm)
        return None
    
    def get_by_id(self, user_id: int) -> Optional[Union[Student, Company, Admin]]:
        """
        Get user by ID with profile (eager loading)
        """
        user_orm = (
            self.db.query(UserORM)
            .options(
                joinedload(UserORM.student),
                joinedload(UserORM.company),
                joinedload(UserORM.admin)
            )
            .filter(UserORM.id == user_id)
            .first()
        )
        if user_orm:
            return user_orm_to_domain(user_orm)
        return None
    
    def activate_user(self, user_id: int) -> Union[Student, Company, Admin]:
        """Activate user using domain logic"""
        user_orm = (
            self.db.query(UserORM)
            .options(
                joinedload(UserORM.student),
                joinedload(UserORM.company),
                joinedload(UserORM.admin)
            )
            .filter(UserORM.id == user_id)
            .first()
        )
        if not user_orm:
            raise ValueError("User not found")
        
        user_domain = user_orm_to_domain(user_orm)
        user_domain.activate()
        
        user_orm.is_active = user_domain.is_active
        self.db.commit()
        self.db.refresh(user_orm)
        
        return user_orm_to_domain(user_orm)
    
    def verify_user(self, user_id: int) -> Union[Student, Company, Admin]:
        """Verify user using domain logic"""
        user_orm = (
            self.db.query(UserORM)
            .options(
                joinedload(UserORM.student),
                joinedload(UserORM.company),
                joinedload(UserORM.admin)
            )
            .filter(UserORM.id == user_id)
            .first()
        )
        if not user_orm:
            raise ValueError("User not found")
        
        user_domain = user_orm_to_domain(user_orm)
        user_domain.verify()
        
        user_orm.is_verified = user_domain.is_verified
        self.db.commit()
        self.db.refresh(user_orm)
        
        return user_orm_to_domain(user_orm)
