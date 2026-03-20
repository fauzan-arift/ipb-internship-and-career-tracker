from typing import Optional
from sqlalchemy.orm import Session, joinedload
from app.models.user import UserORM, StudentORM, CompanyORM, AdminORM


class UserRepository:
    """
    Repository layer for User data access
    Centralizes all database queries related to users
    """

    def __init__(self, db: Session):
        self.db = db

    # ==================== Query Methods ====================

    def get_by_id(self, user_id: int) -> Optional[UserORM]:
        """
        Get user by ID with all profiles eager loaded
        """
        return (
            self.db.query(UserORM)
            .options(
                joinedload(UserORM.student),
                joinedload(UserORM.company),
                joinedload(UserORM.admin)
            )
            .filter(UserORM.id == user_id)
            .first()
        )

    def get_by_email(self, email: str) -> Optional[UserORM]:
        """
        Get user by email with all profiles eager loaded
        """
        return (
            self.db.query(UserORM)
            .options(
                joinedload(UserORM.student),
                joinedload(UserORM.company),
                joinedload(UserORM.admin)
            )
            .filter(UserORM.email == email)
            .first()
        )

    def email_exists(self, email: str) -> bool:
        """
        Check if email already exists in database
        """
        return self.db.query(UserORM).filter(UserORM.email == email).first() is not None

    def nim_exists(self, nim: str) -> bool:
        """
        Check if NIM (student ID) already exists in database
        """
        return self.db.query(StudentORM).filter(StudentORM.nim == nim).first() is not None

    def get_student_by_nim(self, nim: str) -> Optional[StudentORM]:
        """
        Get student by NIM
        """
        return self.db.query(StudentORM).filter(StudentORM.nim == nim).first()

    # ==================== Create Methods ====================

    def create_user(self, user_orm: UserORM) -> UserORM:
        """
        Create a new user in database
        Returns the created user with ID populated
        """
        self.db.add(user_orm)
        self.db.flush()  # Flush to get the ID without committing
        return user_orm

    def create_student_profile(self, student_orm: StudentORM) -> StudentORM:
        """
        Create a student profile in database
        """
        self.db.add(student_orm)
        return student_orm

    def create_company_profile(self, company_orm: CompanyORM) -> CompanyORM:
        """
        Create a company profile in database
        """
        self.db.add(company_orm)
        return company_orm

    def create_admin_profile(self, admin_orm: AdminORM) -> AdminORM:
        """
        Create an admin profile in database
        """
        self.db.add(admin_orm)
        return admin_orm

    # ==================== Update Methods ====================

    def update_user(self, user_orm: UserORM) -> UserORM:
        """
        Update user in database
        """
        self.db.flush()
        return user_orm

    # ==================== Transaction Methods ====================

    def commit(self):
        """
        Commit the current transaction
        """
        self.db.commit()

    def refresh(self, instance):
        """
        Refresh an instance from database
        """
        self.db.refresh(instance)

    def rollback(self):
        """
        Rollback the current transaction
        """
        self.db.rollback()
