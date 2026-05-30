"""
Backfill Script — Career Mapping
=================================
Run ONCE after deploying the career_mappings table to populate historical data
from existing accepted offers.

Logic (mirrors the deduplication guard in offer_service.py):
  - For each accepted offer, find the student's faculty+major and internship's company_id.
  - Count each (faculty, major, company_id, student_id) combination only ONCE
    regardless of how many offers the student accepted at the same company.
  - Upsert into career_mappings accordingly.

Usage (from the backend/ directory):
    python -m scripts.backfill_career_mapping

Or directly:
    python backend/scripts/backfill_career_mapping.py
"""
import asyncio
import logging
import sys
import os

# ── make sure the app package is importable ───────────────────────────────────
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from collections import defaultdict
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.infrastructure.database import AsyncSessionLocal
import app.infrastructure.models  # noqa — registers all ORM metadata
from app.infrastructure.models.application import ApplicationORM
from app.infrastructure.models.offer import OfferORM
from app.infrastructure.models.internship import InternshipORM
from app.infrastructure.models.student import StudentORM
from app.infrastructure.models.career_mapping import CareerMappingORM

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
logger = logging.getLogger("backfill_career_mapping")


async def backfill() -> None:
    async with AsyncSessionLocal() as session:
        # ── Step 1: fetch all accepted offers joined to student + internship ──
        logger.info("Fetching all accepted offers from the database …")
        result = await session.execute(
            select(
                StudentORM.id.label("student_id"),
                StudentORM.faculty,
                StudentORM.major,
                InternshipORM.company_id,
            )
            .join(ApplicationORM, ApplicationORM.student_id == StudentORM.id)
            .join(OfferORM, OfferORM.application_id == ApplicationORM.id)
            .join(InternshipORM, InternshipORM.id == ApplicationORM.internship_id)
            .where(OfferORM.status == "Accepted")
        )
        rows = result.all()
        logger.info("Found %d accepted-offer rows in total.", len(rows))

        # ── Step 2: deduplicate — count each student ONCE per (faculty, major, company) ──
        # Key: (faculty, major, company_id) → set of student_ids
        counts: dict[tuple, set[UUID]] = defaultdict(set)

        skipped = 0
        for row in rows:
            if not row.faculty or not row.major:
                logger.warning(
                    "Skipping student_id=%s — missing faculty or major.", row.student_id
                )
                skipped += 1
                continue
            key = (row.faculty, row.major, row.company_id)
            counts[key].add(row.student_id)

        logger.info(
            "Deduplicated into %d unique (faculty, major, company) groups. "
            "Skipped %d rows with missing faculty/major.",
            len(counts),
            skipped,
        )

        # ── Step 3: upsert into career_mappings ───────────────────────────────
        if not counts:
            logger.info("Nothing to backfill. Exiting.")
            return

        upserted = 0
        for (faculty, major, company_id), student_ids in counts.items():
            total = len(student_ids)

            # Use PostgreSQL INSERT … ON CONFLICT DO UPDATE for atomicity
            stmt = (
                pg_insert(CareerMappingORM)
                .values(
                    faculty=faculty,
                    major=major,
                    company_id=company_id,
                    total_alumni=total,
                )
                .on_conflict_do_update(
                    constraint="uq_career_mapping_faculty_major_company",
                    set_={"total_alumni": total},
                )
            )
            await session.execute(stmt)
            upserted += 1
            logger.info(
                "  %-60s → %d alumnus/alumni",
                f"{faculty} / {major} / {company_id}",
                total,
            )

        await session.commit()
        logger.info(
            "✅  Backfill complete — %d career_mapping rows upserted.", upserted
        )


if __name__ == "__main__":
    asyncio.run(backfill())
