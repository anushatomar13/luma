"""Assembles a chronological timeline from the user's synced snapshots. Real
date extraction lands with real synced data; for now it derives sensible events
from what's present."""


def build_timeline(context: dict) -> list[dict]:
    events: list[dict] = []

    memory = context.get("memory")
    if memory:
        for m in memory.get("memories", []):
            events.append(
                {
                    "time": m.get("subtitle", ""),
                    "title": m.get("title", "Memory"),
                    "kind": "memory",
                }
            )

    travel = context.get("travel")
    if travel:
        events.append(
            {
                "time": "Recent trip",
                "title": f"{travel.get('place')}, {travel.get('country')}",
                "kind": "travel",
            }
        )

    spotify = context.get("spotify")
    if spotify:
        events.append(
            {
                "time": "This week",
                "title": f"{spotify.get('track')} — {spotify.get('artist')}",
                "kind": "music",
            }
        )

    today = context.get("today")
    if today and today.get("nextEvent"):
        events.append(
            {"time": "Today", "title": today.get("nextEvent"), "kind": "event"}
        )

    if not events:
        events.append(
            {"time": "Now", "title": "Your timeline starts here", "kind": "event"}
        )
    return events
