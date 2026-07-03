"""Sync-service framework — the backend mirror of the frontend Widget SDK.

Each integration implements `SyncService` (provider + widgets + demo/fetch) and
registers itself. The pipeline and the generic widget endpoint are decoupled
from any specific provider, exactly like the dashboard is from any widget.
"""

from app.sync.registry import sync_registry
from app.sync.services.ai import AIService
from app.sync.services.google_calendar import GoogleCalendarService
from app.sync.services.google_photos import GooglePhotosService
from app.sync.services.location import LocationService
from app.sync.services.spotify import SpotifyService

sync_registry.register(SpotifyService())
sync_registry.register(GooglePhotosService())
sync_registry.register(GoogleCalendarService())
sync_registry.register(LocationService())
# AI runs last — it derives from the snapshots the others just wrote.
sync_registry.register(AIService())

__all__ = ["sync_registry"]
