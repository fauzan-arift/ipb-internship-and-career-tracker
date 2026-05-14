"""
DocumentService — thin wrapper around FileService for the upload endpoint.
Delegates the actual upload + DB save to FileService, then returns the
DocumentResponse schema for the API layer.
"""
from app.domain.entities.enums import DocumentType
from app.domain.unit_of_work import IUnitOfWork
from app.infrastructure.file_service import FileService
from fastapi import HTTPException, UploadFile, status


class DocumentService:

    def __init__(self, uow: IUnitOfWork, file_service: FileService):
        self.uow = uow
        self.file_service = file_service

    async def upload(self, file: UploadFile, document_type: str):
        """
        Validate document_type, delegate upload to FileService, commit, and
        return the saved Document domain entity.
        """
        # Validate that document_type is a known enum value
        try:
            doc_type = DocumentType(document_type)
        except ValueError:
            valid = [e.value for e in DocumentType]
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"document_type tidak valid. Pilihan: {valid}",
            )

        async with self.uow as uow:
            doc = await self.file_service.upload_document(
                file=file,
                document_type=doc_type.value,
                uow=uow,
            )
            await uow.commit()

        return doc
