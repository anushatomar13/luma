from app.core.config import settings
from app.sync.base import SyncService


class GooglePhotosService(SyncService):
    """Feeds the Memory widget. Live sync (fetch media items + store originals in
    Cloudflare R2) lands with the Google connect-with-photos-scope flow; for now
    it serves curated demo memories through the pipeline."""

    provider = "google_photos"
    widgets = ["memory"]
    supports_live = False

    def is_configured(self) -> bool:
        return settings.google_configured

    def demo_data(self, widget_id: str) -> dict:
        return {
            "memories": [
                {
                    "title": "Sunset in Goa",
                    "subtitle": "This day last year · Dec 2024",
                    "gradient": "linear-gradient(135deg, oklch(0.55 0.18 40), oklch(0.4 0.16 20), oklch(0.3 0.1 300))",
                },
                {
                    "title": "First snow, Manali",
                    "subtitle": "Winter memories · Jan 2025",
                    "gradient": "linear-gradient(135deg, oklch(0.6 0.08 240), oklch(0.45 0.1 260), oklch(0.25 0.06 280))",
                },
                {
                    "title": "Late nights, campus",
                    "subtitle": "Recent favorite · Mar 2025",
                    "gradient": "linear-gradient(135deg, oklch(0.5 0.16 300), oklch(0.4 0.14 320), oklch(0.3 0.1 260))",
                },
            ]
        }
