"""Builds weekly/monthly recaps from the user's synced snapshots. Pure and
snapshot-driven, with sensible demo fallbacks so a recap always renders."""


def build(snapshots: dict, period: str) -> dict:
    spotify = snapshots.get("spotify") or {}
    travel = snapshots.get("travel") or {}
    memory = snapshots.get("memory") or {}
    insights = (snapshots.get("insights") or {}).get("insights", [])
    memories = memory.get("memories") or []

    label = "This week" if period == "weekly" else "This month"

    top_song = {
        "track": spotify.get("track", "Midnight City"),
        "artist": spotify.get("artist", "M83"),
    }
    top_place = {
        "place": travel.get("place", "Goa"),
        "country": travel.get("country", "India"),
        "distanceKm": travel.get("distanceKm", 1487),
    }
    best_memory = memories[0]["title"] if memories else "Sunset in Goa"

    headline = (
        f"{label.lower()}, {top_song['artist']} was on repeat and "
        f"{top_place['place']} was on your mind."
    )

    return {
        "period": period,
        "rangeLabel": label,
        "headline": headline,
        "topSong": top_song,
        "topPlace": top_place,
        "bestMemory": best_memory,
        "insights": insights[:3],
    }
