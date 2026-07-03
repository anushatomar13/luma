from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUserOptional, DbSession
from app.models.widget_snapshot import WidgetSnapshot
from app.sync import sync_registry

router = APIRouter(prefix="/widgets", tags=["widgets"])


@router.get("/{widget_id}")
async def get_widget(
    widget_id: str, user: CurrentUserOptional, db: DbSession
) -> dict:
    """Return a widget's data: the latest synced snapshot for the caller, or the
    service's demo data (anonymous callers, or before a first sync)."""
    service = sync_registry.for_widget(widget_id)
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No sync service for widget '{widget_id}'",
        )

    if user:
        result = await db.execute(
            select(WidgetSnapshot).where(
                WidgetSnapshot.user_id == user.id,
                WidgetSnapshot.widget_id == widget_id,
            )
        )
        snapshot = result.scalar_one_or_none()
        if snapshot:
            return snapshot.data

    return service.demo_data(widget_id)
