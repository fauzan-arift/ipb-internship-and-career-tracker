"""
Domain Interface — IUnitOfWork
Abstract Unit of Work pattern. Async context manager.
"""
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.domain.repositories.user_repository import IUserRepository
    from app.domain.repositories.company_repository import ICompanyRepository
    from app.domain.repositories.document_repository import IDocumentRepository
    from app.domain.repositories.internship_repository import IInternshipRepository
    from app.domain.repositories.application_repository import IApplicationRepository


class IUnitOfWork(ABC):
    users: "IUserRepository"
    companies: "ICompanyRepository"
    documents: "IDocumentRepository"
    internships: "IInternshipRepository"
    applications: "IApplicationRepository"

    @abstractmethod
    async def commit(self) -> None:
        ...

    @abstractmethod
    async def rollback(self) -> None:
        ...

    @abstractmethod
    async def __aenter__(self) -> "IUnitOfWork":
        ...

    @abstractmethod
    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        ...
