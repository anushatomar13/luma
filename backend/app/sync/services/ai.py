from sqlalchemy.orm import Session

from app.ai.insights import get_insight_provider
from app.ai.timeline import build_timeline
from app.models.widget_snapshot import WidgetSnapshot
from app.sync.base import SyncService


class AIService(SyncService):
    """The quiet AI engine. Derives the Insights and Timeline widgets from every
    other synced snapshot — so it must run after them (registered last)."""

    provider = "ai"
    widgets = ["insights", "timeline"]
    supports_live = False
    needs_context = True

    def demo_data(self, widget_id: str) -> dict:
        if widget_id == "timeline":
            return {
                "events": [
                    {"time": "Dec 2024", "title": "Trip to Goa", "kind": "travel"},
                    {"time": "This week", "title": "Midnight City — M83", "kind": "music"},
                    {"time": "Today", "title": "Design review · 5:30", "kind": "event"},
                ]
            }
        return {
            "insights": [
                {"title": "On repeat", "body": "Midnight City by M83 is your track of the week."},
                {"title": "Wanderlust", "body": "Goa: 1,487 km over 6 days."},
                {"title": "Coming up", "body": "Design review is next on your calendar."},
            ]
        }

    def resolve_with_context(
        self, widget_id: str, db: Session, user_id: str
    ) -> tuple[dict, bool]:
        snapshots = (
            db.query(WidgetSnapshot).filter_by(user_id=user_id).all()
        )
        context = {s.widget_id: s.data for s in snapshots}
        if not context:
            return self.demo_data(widget_id), False

        if widget_id == "timeline":
            return {"events": build_timeline(context)}, False

        provider = get_insight_provider()
        return {"insights": provider.generate(context)}, provider.is_live
