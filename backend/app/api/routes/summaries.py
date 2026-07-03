from typing import Literal

from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.widget_snapshot import WidgetSnapshot
from app.services import summary_service

router = APIRouter(prefix="/summaries", tags=["summaries"])


@router.get("/{period}")
async def get_summary(
    period: Literal["weekly", "monthly"], user: CurrentUser, db: DbSession
) -> dict:
    result = await db.execute(
        select(WidgetSnapshot).where(WidgetSnapshot.user_id == user.id)
    )
    snapshots = {s.widget_id: s.data for s in result.scalars().all()}
    return summary_service.build(snapshots, period)
