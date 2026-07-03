"""Synchronous DB access for Celery workers.

The web app uses async SQLAlchemy; Celery tasks are synchronous, so they get a
sync engine here (same database, sync driver) to avoid nesting event loops.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


def _sync_url(url: str) -> str:
    return url.replace("+aiosqlite", "").replace("+asyncpg", "+psycopg")


sync_engine = create_engine(_sync_url(settings.database_url), future=True)

if settings.database_url.startswith("sqlite"):

    @event.listens_for(sync_engine, "connect")
    def _sqlite_pragmas(dbapi_conn, _record):  # noqa: ANN001
        # WAL lets the async web reader and this sync writer coexist.
        cur = dbapi_conn.cursor()
        cur.execute("PRAGMA journal_mode=WAL")
        cur.execute("PRAGMA busy_timeout=5000")
        cur.close()


SyncSessionLocal = sessionmaker(
    bind=sync_engine, class_=Session, expire_on_commit=False
)
