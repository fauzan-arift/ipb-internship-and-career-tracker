from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.entities.user import User
from app.domain.entities.student import Student
from app.domain.entities.hr import HR
from app.domain.entities.admin import Admin
from app.domain.entities.email_notification import EmailNotification
from app.domain.entities.verification_token import VerificationToken
from app.domain.entities.enums import UserRole, UserStatus
from app.domain.repositories.user_repository import IUserRepository
from app.infrastructure.models.user import UserORM
from app.infrastructure.models.student import StudentORM
from app.infrastructure.models.hr import HrORM
from app.infrastructure.models.admin import AdminORM
from app.infrastructure.models.email_notification import EmailNotificationORM
from app.infrastructure.models.verification_token import VerificationTokenORM
from app.infrastructure.models.skill import SkillORM


class SQLAlchemyUserRepository(IUserRepository):

    def __init__(self, session: AsyncSession):
        self._session = session

    # ==================== Mappers ====================

    def _user_to_domain(self, orm: UserORM) -> User:
        return User(
            id=orm.id,
            full_name=orm.full_name,
            email=orm.email,
            password_hash=orm.hashed_password,
            role=orm.role,
            status=orm.status,
            created_at=orm.created_at,
            updated_at=orm.updated_at,
        )

    def _student_to_domain(self, user_orm: UserORM, student_orm: StudentORM) -> Student:
        return Student(
            id=user_orm.id,
            profile_id=student_orm.id,
            full_name=user_orm.full_name,
            email=user_orm.email,
            password_hash=user_orm.hashed_password,
            role=user_orm.role,
            status=user_orm.status,
            nim=student_orm.nim,
            major=student_orm.major,
            faculty=student_orm.faculty,
            graduation_year=student_orm.graduation_year,
            gpa=student_orm.gpa,
            phone_number=student_orm.phone_number,
            skills=[s.name for s in student_orm.skills] if student_orm.skills else [],
            cv_id=student_orm.cv_id,
            photo_profile_id=student_orm.photo_profile_id,
            created_at=user_orm.created_at,
            updated_at=user_orm.updated_at,
        )

    def _hr_to_domain(self, user_orm: UserORM, hr_orm: HrORM) -> HR:
        return HR(
            id=user_orm.id,
            profile_id=hr_orm.id,
            full_name=user_orm.full_name,
            email=user_orm.email,
            password_hash=user_orm.hashed_password,
            role=user_orm.role,
            status=user_orm.status,
            position=hr_orm.position,
            phone_number=hr_orm.phone_number,
            created_at=user_orm.created_at,
            updated_at=user_orm.updated_at,
        )

    def _admin_to_domain(self, user_orm: UserORM, admin_orm: AdminORM) -> Admin:
        return Admin(
            id=user_orm.id,
            profile_id=admin_orm.id,
            full_name=user_orm.full_name,
            email=user_orm.email,
            password_hash=user_orm.hashed_password,
            role=user_orm.role,
            status=user_orm.status,
            created_at=user_orm.created_at,
            updated_at=user_orm.updated_at,
        )

    def _resolve_user_orm(self, orm: UserORM) -> User:
        """Returns the base User entity. Use specific methods for HR/Student profiles."""
        return self._user_to_domain(orm)

    # ==================== Queries ====================

    async def _base_query(self, stmt):
        stmt = stmt.options(
            selectinload(UserORM.student),
            selectinload(UserORM.hr),
            selectinload(UserORM.admin),
        )
        return stmt

    async def get_by_id(self, id: UUID) -> Optional[User]:
        stmt = await self._base_query(select(UserORM).where(UserORM.id == id))
        result = await self._session.execute(stmt)
        orm = result.scalars().first()
        return self._resolve_user_orm(orm) if orm else None

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = await self._base_query(select(UserORM).where(UserORM.email == email))
        result = await self._session.execute(stmt)
        orm = result.scalars().first()
        return self._resolve_user_orm(orm) if orm else None

    async def get_pending_hrs(self) -> List[HR]:
        stmt = await self._base_query(
            select(UserORM)
            .where(UserORM.role == UserRole.HR, UserORM.status == UserStatus.PENDING)
            .order_by(UserORM.created_at.desc())
        )
        result = await self._session.execute(stmt)
        rows = result.scalars().all()
        hrs = []
        for row in rows:
            if row.hr:
                hrs.append(self._hr_to_domain(row, row.hr))
        return hrs

    async def get_processed_hrs(self) -> List[HR]:
        stmt = await self._base_query(
            select(UserORM)
            .where(UserORM.role == UserRole.HR, UserORM.status != UserStatus.PENDING)
            .order_by(UserORM.updated_at.desc())
        )
        result = await self._session.execute(stmt)
        rows = result.scalars().all()
        hrs = []
        for row in rows:
            if row.hr:
                hrs.append(self._hr_to_domain(row, row.hr))
        return hrs

    async def get_hr_by_id(self, hr_id: UUID) -> Optional[HR]:
        stmt = (
            select(HrORM)
            .options(selectinload(HrORM.user))
            .where(HrORM.id == hr_id)
        )
        result = await self._session.execute(stmt)
        orm = result.scalars().first()
        return self._hr_to_domain(orm.user, orm) if orm and orm.user else None

    async def get_hr_by_user_id(self, user_id: UUID) -> Optional[HR]:
        stmt = (
            select(HrORM)
            .options(selectinload(HrORM.user))
            .where(HrORM.user_id == user_id)
        )
        result = await self._session.execute(stmt)
        hr_orm = result.scalars().first()
        if not hr_orm or not hr_orm.user:
            return None
        return self._hr_to_domain(hr_orm.user, hr_orm)

    async def get_student_profile_by_user_id(self, user_id: UUID) -> Optional[Student]:
        stmt = (
            select(StudentORM)
            .options(selectinload(StudentORM.user), selectinload(StudentORM.skills))
            .where(StudentORM.user_id == user_id)
        )
        result = await self._session.execute(stmt)
        student_orm = result.scalars().first()
        if not student_orm or not student_orm.user:
            return None
        return self._student_to_domain(student_orm.user, student_orm)

    async def get_student_profile_by_id(self, student_profile_id: UUID) -> Optional[Student]:
        """Fetch student profile by the students table PK (profile_id)."""
        stmt = (
            select(StudentORM)
            .options(selectinload(StudentORM.user), selectinload(StudentORM.skills))
            .where(StudentORM.id == student_profile_id)
        )
        result = await self._session.execute(stmt)
        student_orm = result.scalars().first()
        if not student_orm or not student_orm.user:
            return None
        return self._student_to_domain(student_orm.user, student_orm)

    async def get_admin_by_user_id(self, user_id: UUID) -> Optional[Admin]:
        stmt = (
            select(AdminORM)
            .options(selectinload(AdminORM.user))
            .where(AdminORM.user_id == user_id)
        )
        result = await self._session.execute(stmt)
        admin_orm = result.scalars().first()
        if not admin_orm or not admin_orm.user:
            return None
        return self._admin_to_domain(admin_orm.user, admin_orm)

    # ==================== Writes ====================

    async def save(self, user: User) -> User:
        """
        Upsert the users table row.
        Domain identity is users.id for all account entities.
        """
        existing = None
        users_table_id = user.id

        if users_table_id:
            result = await self._session.execute(
                select(UserORM).where(UserORM.id == users_table_id)
            )
            existing = result.scalars().first()

        if existing:
            existing.email = user.email
            existing.hashed_password = user.password_hash
            existing.full_name = user.full_name
            existing.role = user.role
            existing.status = user.status
            orm = existing
        else:
            orm = UserORM(
                email=user.email,
                hashed_password=user.password_hash,
                full_name=user.full_name,
                role=user.role,
                status=user.status,
            )
            if users_table_id:
                orm.id = users_table_id
            self._session.add(orm)

        await self._session.flush()
        return user.model_copy(update={"id": orm.id})

    async def save_student(self, student: Student) -> Student:
        # Upsert user record first
        user_result = await self._session.execute(
            select(UserORM).where(UserORM.id == student.id)
        ) if student.id else None

        if user_result:
            user_orm = user_result.scalars().first()
        else:
            user_orm = None

        if not user_orm:
            user_orm = UserORM(
                email=student.email,
                hashed_password=student.password_hash,
                full_name=student.full_name,
                role=student.role,
                status=student.status,
            )
            self._session.add(user_orm)
            await self._session.flush()
        else:
            user_orm.status = student.status

        # Upsert student profile
        s_result = await self._session.execute(
            select(StudentORM)
            .options(selectinload(StudentORM.skills))
            .where(StudentORM.user_id == user_orm.id)
        )
        s_orm = s_result.scalars().first()
        if not s_orm:
            s_orm = StudentORM(user_id=user_orm.id)
            self._session.add(s_orm)

        s_orm.nim = student.nim
        s_orm.major = student.major
        s_orm.faculty = student.faculty
        s_orm.graduation_year = student.graduation_year
        s_orm.gpa = student.gpa
        s_orm.phone_number = student.phone_number
        
        if student.skills is not None:
            skills_result = await self._session.execute(
                select(SkillORM).where(SkillORM.name.in_(student.skills))
            )
            existing_skills = {s.name: s for s in skills_result.scalars().all()}
            
            new_skills = []
            for skill_name in student.skills:
                if skill_name not in existing_skills:
                    new_skill = SkillORM(name=skill_name)
                    self._session.add(new_skill)
                    new_skills.append(new_skill)
            
            s_orm.skills = list(existing_skills.values()) + new_skills

        s_orm.cv_id = student.cv_id
        s_orm.photo_profile_id = student.photo_profile_id

        await self._session.flush()
        return student.model_copy(update={"id": user_orm.id, "profile_id": s_orm.id})

    async def save_hr(self, hr: HR) -> HR:
        # Upsert user record
        user_orm = None
        if hr.id:
            r = await self._session.execute(select(UserORM).where(UserORM.id == hr.id))
            user_orm = r.scalars().first()

        if not user_orm:
            user_orm = UserORM(
                email=hr.email,
                hashed_password=hr.password_hash,
                full_name=hr.full_name,
                role=hr.role,
                status=hr.status,
            )
            self._session.add(user_orm)
            await self._session.flush()
        else:
            user_orm.status = hr.status
            user_orm.full_name = hr.full_name

        # Upsert HR profile
        h_result = await self._session.execute(
            select(HrORM).where(HrORM.user_id == user_orm.id)
        )
        h_orm = h_result.scalars().first()
        if not h_orm:
            h_orm = HrORM(user_id=user_orm.id)
            self._session.add(h_orm)

        h_orm.position = hr.position
        h_orm.phone_number = getattr(hr, "phone_number", None)
        await self._session.flush()
        return hr.model_copy(update={"id": user_orm.id, "profile_id": h_orm.id})

    async def save_admin(self, admin: Admin) -> Admin:
        user_orm = None
        if admin.id:
            result = await self._session.execute(select(UserORM).where(UserORM.id == admin.id))
            user_orm = result.scalars().first()

        if not user_orm:
            user_orm = UserORM(
                email=admin.email,
                hashed_password=admin.password_hash,
                full_name=admin.full_name,
                role=admin.role,
                status=admin.status,
            )
            self._session.add(user_orm)
            await self._session.flush()
        else:
            user_orm.email = admin.email
            user_orm.hashed_password = admin.password_hash
            user_orm.full_name = admin.full_name
            user_orm.role = admin.role
            user_orm.status = admin.status

        admin_result = await self._session.execute(
            select(AdminORM).where(AdminORM.user_id == user_orm.id)
        )
        admin_orm = admin_result.scalars().first()
        if not admin_orm:
            admin_orm = AdminORM(user_id=user_orm.id)
            self._session.add(admin_orm)

        await self._session.flush()
        return admin.model_copy(update={"id": user_orm.id, "profile_id": admin_orm.id})

    async def save_verification_token(self, token: VerificationToken) -> VerificationToken:
        existing = None
        if token.id:
            r = await self._session.execute(
                select(VerificationTokenORM).where(VerificationTokenORM.id == token.id)
            )
            existing = r.scalars().first()

        if existing:
            existing.is_used = token.is_used
            existing.expires_at = token.expires_at
            orm = existing
        else:
            orm = VerificationTokenORM(
                user_id=token.user_id,
                token_hash=token.token_hash,
                expires_at=token.expires_at,
                is_used=token.is_used,
            )
            self._session.add(orm)

        await self._session.flush()
        return token.model_copy(update={"id": orm.id})

    async def get_verification_token(self, token_hash: str) -> Optional[VerificationToken]:
        r = await self._session.execute(
            select(VerificationTokenORM).where(VerificationTokenORM.token_hash == token_hash)
        )
        orm = r.scalars().first()
        if not orm:
            return None
        return VerificationToken(
            id=orm.id,
            user_id=orm.user_id,
            token_hash=orm.token_hash,
            expires_at=orm.expires_at,
            is_used=orm.is_used,
            created_at=orm.created_at,
        )

    async def invalidate_old_tokens(self, user_id: UUID) -> None:
        await self._session.execute(
            update(VerificationTokenORM)
            .where(
                VerificationTokenORM.user_id == user_id,
                VerificationTokenORM.is_used == False,  # noqa: E712
            )
            .values(is_used=True)
        )

    async def save_email_notification(self, notif: EmailNotification) -> EmailNotification:
        orm = EmailNotificationORM(
            recipient_id=notif.recipient_id,
            subject=notif.subject,
            body=notif.body,
            status=notif.status,
            reference_id=notif.reference_id,
            reference_type=notif.reference_type,
        )
        self._session.add(orm)
        await self._session.flush()
        return notif.model_copy(update={"id": orm.id})

    # ==================== Profile Updates ====================

    async def update_student_profile(
        self,
        user_id: UUID,
        data: dict,
    ) -> Optional[Student]:
        """Partial update of UserORM + StudentORM from a dict of changed fields."""
        user_r = await self._session.execute(select(UserORM).where(UserORM.id == user_id))
        user_orm = user_r.scalars().first()
        if not user_orm:
            return None

        student_r = await self._session.execute(
            select(StudentORM)
            .options(selectinload(StudentORM.skills))
            .where(StudentORM.user_id == user_id)
        )
        student_orm = student_r.scalars().first()
        if not student_orm:
            return None

        # Fields that live on UserORM
        user_fields = {"full_name", "email"}
        
        skills_data = data.pop("skills", None)
        if skills_data is not None:
            skills_result = await self._session.execute(
                select(SkillORM).where(SkillORM.name.in_(skills_data))
            )
            existing_skills = {s.name: s for s in skills_result.scalars().all()}
            
            new_skills = []
            for skill_name in skills_data:
                if skill_name not in existing_skills:
                    new_skill = SkillORM(name=skill_name)
                    self._session.add(new_skill)
                    new_skills.append(new_skill)
            
            student_orm.skills = list(existing_skills.values()) + new_skills

        for field, value in data.items():
            if field in user_fields:
                setattr(user_orm, field, value)
            else:
                if hasattr(student_orm, field):
                    setattr(student_orm, field, value)

        await self._session.flush()
        return self._student_to_domain(user_orm, student_orm)

    async def update_hr_profile(
        self,
        user_id: UUID,
        data: dict,
    ) -> Optional[HR]:
        """Partial update of HrORM fields from a dict of changed fields."""
        user_r = await self._session.execute(select(UserORM).where(UserORM.id == user_id))
        user_orm = user_r.scalars().first()
        if not user_orm:
            return None

        hr_r = await self._session.execute(
            select(HrORM).where(HrORM.user_id == user_id)
        )
        hr_orm = hr_r.scalars().first()
        if not hr_orm:
            return None

        user_fields = {"full_name", "email"}
        for field, value in data.items():
            if field in user_fields:
                setattr(user_orm, field, value)
            else:
                if hasattr(hr_orm, field):
                    setattr(hr_orm, field, value)

        await self._session.flush()
        return self._hr_to_domain(user_orm, hr_orm)
