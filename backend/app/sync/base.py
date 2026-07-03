from app.models.connection import Connection


class SyncService:
    """Base class for a widget's data source.

    A service owns one provider and the widget(s) it feeds. `resolve()` centralizes
    the live-vs-demo decision so callers never branch on configuration.
    """

    provider: str = ""
    widgets: list[str] = []
    supports_live: bool = False
    # Services that derive from other widgets' data (e.g. AI insights) need the
    # DB + user; the worker calls resolve_with_context for these.
    needs_context: bool = False

    def resolve_with_context(
        self, widget_id: str, db: object, user_id: str
    ) -> tuple[dict, bool]:
        return self.resolve(widget_id, None)

    def is_configured(self) -> bool:
        """Whether real API credentials are set (else demo data is served)."""
        return False

    def demo_data(self, widget_id: str) -> dict:
        raise NotImplementedError

    def fetch(self, widget_id: str, connection: Connection) -> dict:
        """Real, synchronous API fetch (used by the Celery worker)."""
        raise NotImplementedError

    def resolve(
        self, widget_id: str, connection: Connection | None
    ) -> tuple[dict, bool]:
        """Return (data, is_live). Falls back to demo on any failure."""
        if connection and self.supports_live and self.is_configured():
            try:
                return self.fetch(widget_id, connection), True
            except Exception:
                return self.demo_data(widget_id), False
        return self.demo_data(widget_id), False
