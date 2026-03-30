import asyncio
from uuid import UUID
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select

from app.core.config import settings
from app.infrastructure.models.user import UserORM
from app.infrastructure.models.hr import HrORM
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork
from app.application.services.email_service import EmailService
from app.application.services.admin_service import AdminService
from app.infrastructure.brevo_client import BrevoClient

async def debug():
    db_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://") if settings.DATABASE_URL.startswith("postgresql://") else settings.DATABASE_URL.replace("postgres://", "postgresql+asyncpg://")
    engine = create_async_engine(db_url)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    
    async with session_factory() as session:
        # Find a pending HR
        result = await session.execute(
            select(HrORM).join(UserORM).where(UserORM.status == "PENDING")
        )
        hr_orm = result.scalars().first()
        
        if not hr_orm:
            print("No pending HR found.")
            return
            
        print(f"Found pending HR: {hr_orm.id}")
        
    uow = SQLAlchemyUnitOfWork(session_factory)
    class DummyEmailService:
        async def send_hr_approval_email(self, *args, **kwargs):
            pass
        async def send_hr_rejection_email(self, *args, **kwargs):
            pass
    email_svc = DummyEmailService()
    admin_svc = AdminService(uow, email_svc)
    
    try:
        await admin_svc.approve_hr(hr_orm.id)
        print("Approval succeeded!")
    except Exception as e:
        print(f"Approval failed with exception: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug())
