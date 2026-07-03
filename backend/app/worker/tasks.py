import datetime as dt

from sqlalchemy.orm import Session

from app.db.sync_session import SyncSessionLocal
from app.models.connection import Connection
from app.models.sync_job import SyncJob
from app.models.widget_snapshot import WidgetSnapshot
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
                data, is_live = service.resolve(widget_id, conn)
                _upsert_snapshot(db, user_id, widget_id, data, is_live)
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
