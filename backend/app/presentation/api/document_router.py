"""
Document Upload Router
POST /api/v1/documents/upload — authenticated users only.
Accepts a file + document_type form field, saves via Cloudinary, returns DocumentResponse.
"""
from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.application.services.document_service import DocumentService
from app.infrastructure.file_service import FileService
from app.infrastructure.unit_of_work import SQLAlchemyUnitOfWork
from app.presentation.dependencies import get_file_service, get_uow, get_current_user
from app.presentation.schemas.document import DocumentResponse

router = APIRouter()


def get_document_service(
    uow: SQLAlchemyUnitOfWork = Depends(get_uow),
    file_service: FileService = Depends(get_file_service),
) -> DocumentService:
    return DocumentService(uow=uow, file_service=file_service)


@router.post(
    "/upload",
    summary="Upload dokumen (CV, foto profil, NPWP, dll.)",
    response_model=DocumentResponse,
    status_code=201,
)
async def upload_document(
    file: UploadFile = File(..., description="File yang akan diupload (PDF/JPG/PNG, maks 5 MB)"),
    document_type: str = Form(
        ...,
        description="Tipe dokumen: CV | NPWP | PROFILE_PHOTO | OTHER",
    ),
    _current_user=Depends(get_current_user),  # auth guard — any verified role
    svc: DocumentService = Depends(get_document_service),
):
    """
    Upload sebuah dokumen ke Cloudinary dan simpan record-nya ke DB.
    Kembalikan `id` dokumen yang nantinya digunakan untuk mengisi
    `cv_id` atau `photo_profile_id` di profil.
    """
    doc = await svc.upload(file=file, document_type=document_type)
    return DocumentResponse(
        id=doc.id,
        document_type=doc.document_type,
        file_name=doc.file_name,
        file_url=doc.file_url,
        file_format=doc.file_format,
        upload_date=doc.upload_date,
        created_at=doc.created_at,
    )
