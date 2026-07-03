from app.sync.base import SyncService


class LocationService(SyncService):
    """Feeds the Travel widget. Live location comes from client geolocation +
    reverse geocoding (a later step); for now it serves demo trip data through
    the pipeline."""

    provider = "location"
    widgets = ["travel"]
    supports_live = False

    def demo_data(self, widget_id: str) -> dict:
        return {
            "place": "Goa",
            "country": "India",
            "distanceKm": 1487,
            "daysSpent": 6,
            "weather": "31° Sunny",
        }
