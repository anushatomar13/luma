"""Luma's AI layer.

Every capability (embeddings, insights, timeline) is a provider with a
dependency-free deterministic fallback and an optional real backend (OpenAI /
Gemini / Sentence-Transformers / Qdrant) selected by configuration. This keeps
the whole pipeline runnable with zero model downloads or API keys.
"""


def summarize_snapshot(widget_id: str, data: dict) -> str:
    """A short natural-language description of a widget snapshot, used as the
    text we embed for semantic search (Phase 7)."""
    if widget_id == "spotify":
        return f"Listening to {data.get('track')} by {data.get('artist')} from {data.get('album')}."
    if widget_id == "today":
        return f"Today: {data.get('weather')}, next event {data.get('nextEvent')}, playing {data.get('nowPlaying')}."
    if widget_id == "travel":
        return f"Last trip to {data.get('place')}, {data.get('country')} — {data.get('distanceKm')} km over {data.get('daysSpent')} days."
    if widget_id == "memory":
        titles = ", ".join(m.get("title", "") for m in data.get("memories", []))
        return f"Memories: {titles}."
    return " ".join(f"{k}: {v}" for k, v in data.items() if isinstance(v, (str, int, float)))
