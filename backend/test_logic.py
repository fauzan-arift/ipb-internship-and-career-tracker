import asyncio
from uuid import uuid4
from datetime import datetime, timezone

from app.domain.entities.user import User
from app.domain.entities.enums import UserRole, UserStatus
from app.infrastructure.database import AsyncSessionLocal
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork

async def test_logic():
    print("Testing UoW and Entities...")
    uow = SQLAlchemyUnitOfWork(AsyncSessionLocal)
    
    # Create test user entity
    u = User(
        full_name="Tester", 
        email=f"test{uuid4()}@test.com", 
        password_hash="hashed", 
        role=UserRole.STUDENT
    )
    
    async with uow:
        # Save user
        saved_u = await uow.users.save(u)
        print("User saved:", saved_u.id, "verified?", saved_u.is_verified())
        
        # Invalidate tokens
        await uow.users.invalidate_old_tokens(saved_u.id)
        
        # Test rollback by NOT calling commit
        
    async with uow:
        check_u = await uow.users.get_by_id(saved_u.id)
        print("User exists after uncommitted context?", check_u is not None)
        
if __name__ == "__main__":
    asyncio.run(test_logic())
