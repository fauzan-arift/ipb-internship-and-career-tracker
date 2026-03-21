"""initial_auth_schema_uuid

Revision ID: cbd36883f6ef
Revises: 
Create Date: 2026-03-20 17:19:32.614543

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'cbd36883f6ef'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── 1. documents (no FK deps) ─────────────────────────────────────────
    op.create_table(
        'documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('document_type', sa.Enum('CV', 'NPWP', 'OTHER', name='documenttype'), nullable=False),
        sa.Column('file_name', sa.String(length=255), nullable=False),
        sa.Column('file_url', sa.String(length=500), nullable=False),
        sa.Column('file_format', sa.String(length=10), nullable=False),
        sa.Column('upload_date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_documents_id'), 'documents', ['id'], unique=False)

    # ── 2. users (no FK deps) ─────────────────────────────────────────────
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('STUDENT', 'HR', 'ADMIN', name='userrole'), nullable=False),
        sa.Column('status', sa.Enum('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED', name='userstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # ── 3. admins (FK → users) ────────────────────────────────────────────
    op.create_table(
        'admins',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id'),
    )

    # ── 4. students (FK → users) ──────────────────────────────────────────
    op.create_table(
        'students',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('nim', sa.String(length=20), nullable=False),
        sa.Column('major', sa.String(length=100), nullable=False),
        sa.Column('faculty', sa.String(length=100), nullable=True),
        sa.Column('graduation_year', sa.Integer(), nullable=True),
        sa.Column('gpa', sa.Float(), nullable=True),
        sa.Column('phone_number', sa.String(length=20), nullable=True),
        sa.Column('skills', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id'),
    )
    op.create_index(op.f('ix_students_id'), 'students', ['id'], unique=False)
    op.create_index(op.f('ix_students_nim'), 'students', ['nim'], unique=True)

    # ── 5. hrs (FK → users) ───────────────────────────────────────────────
    op.create_table(
        'hrs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('position', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id'),
    )
    op.create_index(op.f('ix_hrs_id'), 'hrs', ['id'], unique=False)

    # ── 6. companies (FK → hrs, documents) ───────────────────────────────
    op.create_table(
        'companies',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('hr_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('npwp_document_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('company_name', sa.String(length=255), nullable=False),
        sa.Column('address', sa.String(length=500), nullable=True),
        sa.Column('industry', sa.String(length=100), nullable=True),
        sa.Column('website', sa.String(length=255), nullable=True),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('verification_status', sa.Enum('PENDING', 'VERIFIED', 'REJECTED', name='companyverificationstatus'), nullable=False),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('registration_date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['hr_id'], ['hrs.id'], ),
        sa.ForeignKeyConstraint(['npwp_document_id'], ['documents.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('hr_id'),
    )
    op.create_index(op.f('ix_companies_id'), 'companies', ['id'], unique=False)

    # ── 7. email_notifications (FK → users) ──────────────────────────────
    op.create_table(
        'email_notifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('recipient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('subject', sa.String(length=500), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('sent_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('status', sa.Enum('SENT', 'FAILED', name='emailnotificationstatus'), nullable=False),
        sa.Column('reference_id', sa.String(length=255), nullable=True),
        sa.Column('reference_type', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['recipient_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_email_notifications_id'), 'email_notifications', ['id'], unique=False)

    # ── 8. verification_tokens (FK → users) ──────────────────────────────
    op.create_table(
        'verification_tokens',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('token_hash', sa.String(length=64), nullable=False),
        sa.Column(
            'token_type',
            sa.Enum('EMAIL_VERIFICATION', 'PASSWORD_RESET', name='tokentype'),
            nullable=False,
            server_default='EMAIL_VERIFICATION',
        ),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_used', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_verification_tokens_id'), 'verification_tokens', ['id'], unique=False)
    op.create_index(op.f('ix_verification_tokens_token_hash'), 'verification_tokens', ['token_hash'], unique=True)


def downgrade() -> None:
    # Drop tables in reverse dependency order
    op.drop_index(op.f('ix_verification_tokens_token_hash'), table_name='verification_tokens')
    op.drop_index(op.f('ix_verification_tokens_id'), table_name='verification_tokens')
    op.drop_table('verification_tokens')

    op.drop_index(op.f('ix_email_notifications_id'), table_name='email_notifications')
    op.drop_table('email_notifications')

    op.drop_index(op.f('ix_companies_id'), table_name='companies')
    op.drop_table('companies')

    op.drop_index(op.f('ix_hrs_id'), table_name='hrs')
    op.drop_table('hrs')

    op.drop_index(op.f('ix_students_nim'), table_name='students')
    op.drop_index(op.f('ix_students_id'), table_name='students')
    op.drop_table('students')

    op.drop_table('admins')

    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')

    op.drop_index(op.f('ix_documents_id'), table_name='documents')
    op.drop_table('documents')

    # Drop custom PostgreSQL enum types
    sa.Enum(name='tokentype').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='emailnotificationstatus').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='companyverificationstatus').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='userstatus').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='userrole').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='documenttype').drop(op.get_bind(), checkfirst=True)
