import httpx

from app.core.config import settings
from app.models.connection import Connection
from app.sync.base import SyncService

API_BASE = "https://api.spotify.com/v1"


class SpotifyService(SyncService):
    provider = "spotify"
    widgets = ["spotify"]
    supports_live = True

    def is_configured(self) -> bool:
        return settings.spotify_configured

    def demo_data(self, widget_id: str) -> dict:
        return {
            "track": "Midnight City",
            "artist": "M83",
            "album": "Hurry Up, We're Dreaming",
            "progressSec": 154,
            "durationSec": 241,
            "isPlaying": True,
            "isLive": False,
        }

    def fetch(self, widget_id: str, connection: Connection) -> dict:
        headers = {"Authorization": f"Bearer {connection.access_token}"}
        with httpx.Client(timeout=10) as client:
            now = client.get(f"{API_BASE}/me/player/currently-playing", headers=headers)
            if now.status_code == 200 and now.json().get("item"):
                payload = now.json()
                return self._normalize(
                    payload["item"],
                    payload.get("progress_ms", 0),
                    payload.get("is_playing", False),
                )
            recent = client.get(
                f"{API_BASE}/me/player/recently-played?limit=1", headers=headers
            )
            recent.raise_for_status()
            items = recent.json().get("items", [])
        if not items:
            return self.demo_data(widget_id)
        return self._normalize(items[0]["track"], 0, False)

    def _normalize(self, item: dict, progress_ms: int, is_playing: bool) -> dict:
        artists = item.get("artists", [])
        return {
            "track": item.get("name", "Unknown"),
            "artist": artists[0]["name"] if artists else "Unknown",
            "album": item.get("album", {}).get("name", ""),
            "progressSec": progress_ms // 1000,
            "durationSec": item.get("duration_ms", 0) // 1000,
            "isPlaying": is_playing,
            "isLive": True,
        }
