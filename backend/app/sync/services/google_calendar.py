import datetime as dt

import httpx

from app.core.config import settings
from app.models.connection import Connection
from app.sync.base import SyncService

CALENDAR_EVENTS_URL = (
    "https://www.googleapis.com/calendar/v3/calendars/primary/events"
)


class GoogleCalendarService(SyncService):
    """Feeds the Today widget. Real fetch pulls the next primary-calendar event;
    weather/now-playing stay demo (weather API + Spotify fill those elsewhere)."""

    provider = "google_calendar"
    widgets = ["today"]
    supports_live = True

    def is_configured(self) -> bool:
        return settings.google_configured

    def demo_data(self, widget_id: str) -> dict:
        return {
            "greeting": "Good evening, Anusha",
            "dateLabel": "Friday · July 3",
            "weather": "28° Clear",
            "nextEvent": "Design review · 5:30",
            "nowPlaying": "Midnight City — M83",
        }

    def fetch(self, widget_id: str, connection: Connection) -> dict:
        now = dt.datetime.now(dt.timezone.utc).isoformat()
        headers = {"Authorization": f"Bearer {connection.access_token}"}
        with httpx.Client(timeout=10) as client:
            res = client.get(
                CALENDAR_EVENTS_URL,
                headers=headers,
                params={
                    "timeMin": now,
                    "maxResults": 1,
                    "singleEvents": "true",
                    "orderBy": "startTime",
                },
            )
            res.raise_for_status()
            items = res.json().get("items", [])

        data = self.demo_data(widget_id)
        if items:
            data["nextEvent"] = items[0].get("summary", "Event")
        return data
