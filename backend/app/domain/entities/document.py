from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel  

from app.domain.entities.enums import DocumentType


class Document(BaseModel):
    id: Optional[UUID] = None
    document_type: DocumentType
    file_name: str
    file_url: str
    file_format: str
    upload_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
