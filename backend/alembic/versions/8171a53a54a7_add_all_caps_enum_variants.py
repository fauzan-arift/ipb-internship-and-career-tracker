"""add_all_caps_enum_variants

Revision ID: 8171a53a54a7
Revises: f63a68e29734
Create Date: 2026-05-16 10:55:17.968055

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8171a53a54a7'
down_revision = 'f63a68e29734'
branch_labels = None
depends_on = None


# New values to add (including All-Caps and variants)
_NEW_VALUES = [
    "Diproses", "Review HR", "Ditolak", "Diterima", "Ditawarkan",
    "DIPROSES", "REVIEW_HR", "DITOLAK", "DITERIMA", "DITAWARKAN",
    "INTERVIEW", "Interview"
]


def upgrade() -> None:
    # PostgreSQL requires ALTER TYPE ... ADD VALUE for enum extensions.
    # Each ADD VALUE is idempotent when used with IF NOT EXISTS.
    for val in _NEW_VALUES:
        op.execute(f"ALTER TYPE applicationstatus ADD VALUE IF NOT EXISTS '{val}'")


def downgrade() -> None:
    # Removing enum values is not natively supported in Postgres
    pass
