"""
Pydantic Response Schemas — Career Mapping
Used by GET /api/v1/students/career-mapping
"""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class CompanyDistributionItem(BaseModel):
    """Stats for one company within this major's career mapping."""
    company_name: str
    industry: Optional[str] = None
    company_logo_url: Optional[str] = None
    total_alumni: int


class CareerMappingResponse(BaseModel):
    """Full career mapping response for the authenticated student's major."""
    faculty: str
    major: str
    grand_total_students: int
    last_updated: Optional[datetime] = None
    company_distributions: List[CompanyDistributionItem]
