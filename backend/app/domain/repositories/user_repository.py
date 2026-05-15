from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from app.domain.entities.user import User
from app.domain.entities.student import Student
from app.domain.entities.hr import HR
from app.domain.entities.admin import Admin
from app.domain.entities.email_notification import EmailNotification
from app.domain.entities.verification_token import VerificationToken


class IUserRepository(ABC):

    @abstractmethod
    async def get_by_id(self, id: UUID) -> Optional[User]:
        ...

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        ...

    @abstractmethod
    async def save(self, user: User) -> User:
        ...

    @abstractmethod
    async def save_student(self, student: Student) -> Student:
        ...

    @abstractmethod
    async def save_hr(self, hr: HR) -> HR:
        ...

    @abstractmethod
    async def get_hr_by_id(self, hr_id: UUID) -> Optional[HR]:
        ...

    @abstractmethod
    async def get_hr_by_user_id(self, user_id: UUID) -> Optional[HR]:
        ...

    @abstractmethod
    async def get_student_profile_by_user_id(self, user_id: UUID) -> Optional[Student]:
        ...

    @abstractmethod
    async def get_student_profile_by_id(self, student_profile_id: UUID) -> Optional[Student]:
        ...

    @abstractmethod
    async def get_admin_by_user_id(self, user_id: UUID) -> Optional[Admin]:
        ...

    @abstractmethod
    async def get_pending_hrs(self) -> List[HR]:
        ...

    @abstractmethod
    async def get_processed_hrs(self) -> List[HR]:
        ...

    @abstractmethod
    async def save_admin(self, admin: Admin) -> Admin:
        ...

    @abstractmethod
    async def save_verification_token(self, token: VerificationToken) -> VerificationToken:
        ...

    @abstractmethod
    async def get_verification_token(self, token_hash: str) -> Optional[VerificationToken]:
        ...

    @abstractmethod
    async def invalidate_old_tokens(self, user_id: UUID) -> None:
        ...

    @abstractmethod
    async def save_email_notification(self, notif: EmailNotification) -> EmailNotification:
        ...

    @abstractmethod
    async def update_student_profile(self, user_id: UUID, data: dict) -> Optional[Student]:
        ...

    @abstractmethod
    async def update_hr_profile(self, user_id: UUID, data: dict) -> Optional[HR]:
        ...
