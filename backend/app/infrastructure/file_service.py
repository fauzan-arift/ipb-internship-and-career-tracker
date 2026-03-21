import os
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status

from app.domain.entities.document import Document
from app.domain.entities.enums import DocumentType
from app.domain.unit_of_work import IUnitOfWork

ALLOWED_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/png"}
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


class FileService:
    async def upload_document(
        self,
        file: UploadFile,
        document_type: str,
        uow: IUnitOfWork,
    ) -> Document:
        original_name = file.filename or "file"
        ext = os.path.splitext(original_name)[-1].lower()

        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tipe file tidak didukung. Gunakan PDF, JPG, atau PNG.",
            )

        content = await file.read()
        if len(content) > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ukuran file melebihi batas 5 MB.",
            )

        await file.seek(0)

        result = cloudinary.uploader.upload(
            file.file,
            folder=f"internship/{document_type}",
            resource_type="auto",
            public_id=str(uuid4()),
        )

        file_url = result["secure_url"]
        file_format = ext.lstrip(".")
        if file_format == "jpeg":
            file_format = "jpg"

        doc = Document(
            document_type=DocumentType(document_type) if isinstance(document_type, str) else document_type,
            file_name=original_name,
            file_url=file_url,
            file_format=file_format,
            upload_date=datetime.now(tz=timezone.utc),
        )
        return await uow.documents.save(doc)

    async def get_document_url(self, document_id: UUID, uow: IUnitOfWork) -> str:
        doc = await uow.documents.get_by_id(document_id)
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dokumen tidak ditemukan.")
        return doc.file_url

    async def delete_document(self, document_id: UUID, uow: IUnitOfWork) -> None:
        doc = await uow.documents.get_by_id(document_id)
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dokumen tidak ditemukan.")
        public_id = doc.file_url.rsplit("/", 1)[-1].rsplit(".", 1)[0]
        folder = f"internship/{doc.document_type.value}"
        cloudinary.uploader.destroy(f"{folder}/{public_id}")
