"""add_career_mappings_table

Revision ID: c3f2a1b4d9e7
Revises: ae99694aed13
Create Date: 2026-05-30 19:38:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c3f2a1b4d9e7'
down_revision = '8171a53a54a7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'career_mappings',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('company_id', sa.UUID(), nullable=False),
        sa.Column('faculty', sa.String(length=100), nullable=False),
        sa.Column('major', sa.String(length=100), nullable=False),
        sa.Column(
            'total_alumni',
            sa.Integer(),
            nullable=False,
            server_default=sa.text('0'),
        ),
        sa.Column(
            'last_updated',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ['company_id'], ['companies.id'],
            ondelete='CASCADE',
        ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint(
            'faculty', 'major', 'company_id',
            name='uq_career_mapping_faculty_major_company',
        ),
    )
    op.create_index(op.f('ix_career_mappings_id'), 'career_mappings', ['id'], unique=False)
    op.create_index(op.f('ix_career_mappings_company_id'), 'career_mappings', ['company_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_career_mappings_company_id'), table_name='career_mappings')
    op.drop_index(op.f('ix_career_mappings_id'), table_name='career_mappings')
    op.drop_table('career_mappings')
