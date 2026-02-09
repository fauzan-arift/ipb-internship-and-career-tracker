"""
Database Seeder - Create default admin account
Run: python -m app.db.seed
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.models.user import UserORM, AdminORM
from app.core.security import get_password_hash


def create_default_admin(db: Session):
    # Check if admin already exists
    existing_admin = db.query(UserORM).filter(UserORM.email == "admin@ipb.ac.id").first()
    if existing_admin:
        print("Default admin already exists: admin@ipb.ac.id")
        return
    
    # Create admin user
    admin_user = UserORM(
        email="admin@ipb.ac.id",
        full_name="IPB Admin",
        hashed_password=get_password_hash("admin123"), 
        is_active=True,
        is_verified=True
    )
    db.add(admin_user)
    db.flush()
    
    # Create admin profile
    admin_profile = AdminORM(user_id=admin_user.id)
    db.add(admin_profile)
    
    db.commit()
    print(f"Default admin created!")
    print(f"   Email: admin@ipb.ac.id")
    print(f"   Password: admin123")
    print(f"   CHANGE PASSWORD IN PRODUCTION!")


def seed_database():
    """Main seeder function"""
    print("Seeding database...")
    
    db = SessionLocal()
    try:
        create_default_admin(db)
        print("Database seeding completed!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
