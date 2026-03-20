from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.repositories.user_repository import UserRepository
from app.models.user import user_orm_to_domain
from app.domain.entities.user import User as UserDomain, UserRole
from app.core.security import decode_access_token

security = HTTPBearer()


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    """Dependency to get UserRepository instance"""
    return UserRepository(db)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    repo: UserRepository = Depends(get_user_repository)
) -> UserDomain:
    """Get current authenticated user - returns Domain Model"""
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

    # Use repository to get user
    user_orm = repo.get_by_id(int(user_id))
    if user_orm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user_domain = user_orm_to_domain(user_orm)

    if not user_domain.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user_domain


def get_current_admin(current_user: UserDomain = Depends(get_current_user)) -> UserDomain:
    """Require admin role - uses domain logic"""
    if not current_user.is_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


def get_current_student(current_user: UserDomain = Depends(get_current_user)) -> UserDomain:
    """Require student role"""
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


def get_current_company(current_user: UserDomain = Depends(get_current_user)) -> UserDomain:
    """Require company role"""
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
