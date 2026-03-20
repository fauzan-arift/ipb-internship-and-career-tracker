"""
Database Seeder - Create default admin account
Run: python -m app.db.seed
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService


def create_default_admin(db: Session):
    """Create default admin user using repository pattern"""
    repo = UserRepository(db)

    # Check if admin already exists
    if repo.email_exists("admin@ipb.ac.id"):
        print("Default admin already exists: admin@ipb.ac.id")
        return

    # Use service layer to create admin
    user_service = UserService(repo)
    try:
        user_service.create_admin(
            email="admin@ipb.ac.id",
            password="admin123",
            full_name="IPB Admin"
        )

        print(f"Default admin created!")
        print(f"   Email: admin@ipb.ac.id")
        print(f"   Password: admin123")
        print(f"   CHANGE PASSWORD IN PRODUCTION!")
    except ValueError as e:
        print(f"Error creating admin: {e}")
        raise


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
