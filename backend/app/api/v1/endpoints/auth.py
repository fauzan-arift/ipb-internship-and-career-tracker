from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.db.database import get_db
from app.schemas.user import (
    UserRegisterStudent, UserRegisterCompany,
    UserLogin, Token, UserResponse
)
from app.models.user import UserORM, StudentORM, user_orm_to_domain
from app.services.user_service import UserService
from app.core.security import verify_password, create_access_token

router = APIRouter()


@router.post("/register/student", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_student(user_data: UserRegisterStudent, db: Session = Depends(get_db)):
    """Register a new student"""
    # Check if email already exists
    if db.query(UserORM).filter(UserORM.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if NIM already exists 
    if db.query(StudentORM).filter(StudentORM.nim == user_data.nim).first():
        raise HTTPException(status_code=400, detail="NIM already registered")
    
    try:
        user_service = UserService(db)
        user_domain = user_service.create_student(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name,
            nim=user_data.nim,
            major=user_data.major
        )
        
        return user_domain
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/register/company", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_company(user_data: UserRegisterCompany, db: Session = Depends(get_db)):
    """Register a new company"""
    # Check if email already exists
    if db.query(UserORM).filter(UserORM.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        # Use service layer with domain validation
        user_service = UserService(db)
        user_domain = user_service.create_company(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name,
            company_name=user_data.company_name,
            company_address=user_data.company_address,
            company_phone=user_data.company_phone
        )
        
        return user_domain
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login endpoint for all user types"""
    user_orm = (
        db.query(UserORM)
        .options(
            joinedload(UserORM.student),
            joinedload(UserORM.company),
            joinedload(UserORM.admin)
        )
        .filter(UserORM.email == credentials.email)
        .first()
    )
    
    if not user_orm or not verify_password(credentials.password, user_orm.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Convert to domain untuk business logic check
    user_domain = user_orm_to_domain(user_orm)
    
    if not user_domain.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user_domain.id), "email": user_domain.email, "role": user_domain.role.value}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_domain
    }


@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    """Get current user info (requires authentication - to be implemented)"""
    pass
