"""add_profile_photo_to_documenttype_enum

Revision ID: cc818dc78600
Revises: 1cb69ad2fce5
Create Date: 2026-05-14 09:25:02.906057

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc818dc78600'
down_revision = '1cb69ad2fce5'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # PostgreSQL requires ALTER TYPE to add enum values.
    # IF NOT EXISTS is available from PG 9.6+
    op.execute("ALTER TYPE documenttype ADD VALUE IF NOT EXISTS 'PROFILE_PHOTO'")


def downgrade() -> None:
    # PostgreSQL does NOT support removing enum values natively.
    # To rollback, the enum would need to be recreated — left as a no-op intentionally.
    pass
