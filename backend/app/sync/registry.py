from app.sync.base import SyncService


class SyncRegistry:
    """Maps providers and widget ids to their sync service."""

    def __init__(self) -> None:
        self._by_provider: dict[str, SyncService] = {}
        self._by_widget: dict[str, SyncService] = {}

    def register(self, service: SyncService) -> None:
        self._by_provider[service.provider] = service
        for widget_id in service.widgets:
            self._by_widget[widget_id] = service

    def for_provider(self, provider: str) -> SyncService | None:
        return self._by_provider.get(provider)

    def for_widget(self, widget_id: str) -> SyncService | None:
        return self._by_widget.get(widget_id)

    def providers(self) -> list[str]:
        return list(self._by_provider.keys())


sync_registry = SyncRegistry()
