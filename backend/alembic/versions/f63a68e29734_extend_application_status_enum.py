"""extend_application_status_enum

Revision ID: f63a68e29734
Revises: ae99694aed13
Create Date: 2026-05-15 10:29:04.392183

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f63a68e29734'
down_revision = 'ae99694aed13'
branch_labels = None
depends_on = None

# New HR workflow enum values to add
_NEW_VALUES = ["Diproses", "Review HR", "Ditolak", "Diterima", "Ditawarkan"]


def upgrade() -> None:
    # PostgreSQL requires ALTER TYPE ... ADD VALUE for enum extensions.
    # Each ADD VALUE is idempotent when used with IF NOT EXISTS.
    for val in _NEW_VALUES:
        op.execute(f"ALTER TYPE applicationstatus ADD VALUE IF NOT EXISTS '{val}'")


def downgrade() -> None:
    # PostgreSQL does not support removing enum values natively.
    # A full type rebuild would be needed; skip for dev safety.
    pass
