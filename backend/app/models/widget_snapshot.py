import datetime as dt
import uuid

from sqlalchemy import JSON, DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class WidgetSnapshot(Base):
    """The latest normalized data for a (user, widget), produced by the sync
    pipeline and read by the dashboard. This is the pipeline's 'store' step."""

    __tablename__ = "widget_snapshots"
    __table_args__ = (
        UniqueConstraint("user_id", "widget_id", name="uq_snapshot_user_widget"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    widget_id: Mapped[str] = mapped_column(String(60), nullable=False)
    data: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    is_live: Mapped[bool] = mapped_column(default=False, nullable=False)
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
