import datetime as dt

from sqlalchemy.orm import Session

from app.ai import summarize_snapshot
from app.ai.embeddings import get_embedding_provider
from app.db.sync_session import SyncSessionLocal
from app.models.connection import Connection
from app.models.sync_job import SyncJob
from app.models.user import User
from app.models.widget_snapshot import WidgetSnapshot
from app.services import document_service, summary_service
from app.sync import sync_registry
from app.worker.celery_app import celery_app


@celery_app.task(name="sync_provider")
def sync_provider(user_id: str, provider: str) -> dict:
    """The pipeline: fetch each of a provider's widgets (live if connected, else
    demo) and store snapshots the dashboard reads. Records a SyncJob."""
    service = sync_registry.for_provider(provider)
    if service is None:
        return {"provider": provider, "status": "skipped"}

    with SyncSessionLocal() as db:
        job = SyncJob(user_id=user_id, provider=provider, status="running")
        db.add(job)
        db.commit()

        try:
            conn = (
                db.query(Connection)
                .filter_by(user_id=user_id, provider=provider)
                .first()
            )
            for widget_id in service.widgets:
                if service.needs_context:
                    data, is_live = service.resolve_with_context(
                        widget_id, db, user_id
                    )
                else:
                    data, is_live = service.resolve(widget_id, conn)
                _upsert_snapshot(db, user_id, widget_id, data, is_live)
                # AI enrichment: embed the snapshot for semantic search.
                if not service.needs_context:
                    _embed_snapshot(db, user_id, widget_id, data)
            job.status = "done"
        except Exception:
            job.status = "failed"

        job.finished_at = dt.datetime.now(dt.timezone.utc)
        db.commit()
        return {"provider": provider, "status": job.status}


def _upsert_snapshot(
    db: Session, user_id: str, widget_id: str, data: dict, is_live: bool
) -> None:
    snap = (
        db.query(WidgetSnapshot)
        .filter_by(user_id=user_id, widget_id=widget_id)
        .first()
    )
    if snap is None:
        db.add(
            WidgetSnapshot(
                user_id=user_id, widget_id=widget_id, data=data, is_live=is_live
            )
        )
    else:
        snap.data = data
        snap.is_live = is_live
    db.commit()


@celery_app.task(name="generate_weekly_summaries")
def generate_weekly_summaries() -> dict:
    """Scheduled weekly recap generation for every user (see beat_schedule).
    In production this would persist/notify; here it builds the recap."""
    count = 0
    with SyncSessionLocal() as db:
        for user in db.query(User).all():
            snaps = db.query(WidgetSnapshot).filter_by(user_id=user.id).all()
            summary_service.build({s.widget_id: s.data for s in snaps}, "weekly")
            count += 1
    return {"users": count}


def _embed_snapshot(
    db: Session, user_id: str, widget_id: str, data: dict
) -> None:
    text = summarize_snapshot(widget_id, data)
    embedding = get_embedding_provider().embed(text)
    document_service.upsert_sync(
        db, user_id=user_id, kind=widget_id, text=text, embedding=embedding
    )
