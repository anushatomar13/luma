from fastapi import APIRouter
from sqlalchemy import desc, select

from app.api.deps import CurrentUser, DbSession
from app.models.sync_job import SyncJob
from app.schemas.widget import SyncJobRead
from app.sync import sync_registry
from app.worker.tasks import sync_provider

router = APIRouter(prefix="/sync", tags=["sync"])


@router.post("")
async def trigger_sync(user: CurrentUser) -> dict:
    """Queue a sync across every provider (runs eagerly without a broker)."""
    providers = sync_registry.providers()
    for provider in providers:
        sync_provider.delay(user.id, provider)
    return {"queued": providers}


@router.get("/jobs", response_model=list[SyncJobRead])
async def list_jobs(user: CurrentUser, db: DbSession) -> list[SyncJob]:
    result = await db.execute(
        select(SyncJob)
        .where(SyncJob.user_id == user.id)
        .order_by(desc(SyncJob.created_at))
        .limit(20)
    )
    return list(result.scalars().all())
