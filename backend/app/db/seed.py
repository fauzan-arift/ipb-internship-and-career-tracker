import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.core.security import get_password_hash

from app.infrastructure.models.user import UserORM
from app.infrastructure.models.admin import AdminORM
from app.domain.entities.enums import UserRole, UserStatus


def get_sync_session() -> sessionmaker:
    db_url = settings.DATABASE_URL
    db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
    db_url = db_url.replace("asyncpg://", "postgresql://")
    engine = create_engine(db_url)
    return sessionmaker(bind=engine, autocommit=False, autoflush=False)


def create_default_admin(db: Session) -> None:
    admin_email = settings.ADMIN_EMAIL

    existing = db.query(UserORM).filter(UserORM.email == admin_email).first()
    if existing:
        print(f"Admin sudah ada: {admin_email}")
        return

    user = UserORM(
        email=admin_email,
        full_name=settings.ADMIN_FULL_NAME,
        hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
        role=UserRole.ADMIN,
        status=UserStatus.VERIFIED,
    )
    db.add(user)
    db.flush()

    db.add(AdminORM(user_id=user.id))
    db.commit()
    db.refresh(user)

    print("=" * 50)
    print("Admin berhasil dibuat!")
    print(f"   Email   : {admin_email}")
    print(f"   Password: {settings.ADMIN_PASSWORD}")
    print("   GANTI PASSWORD DI PRODUCTION!")
    print(f"   UUID    : {user.id}")
    print("=" * 50)


def seed_database() -> None:
    print("Seeding database...")
    SessionLocal = get_sync_session()
    db = SessionLocal()
    try:
        create_default_admin(db)
        print("Seeding selesai!")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
