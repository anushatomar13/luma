import json

from app.core.config import settings


class InsightProvider:
    is_live = False

    def generate(self, context: dict) -> list[dict]:
        """context maps widget_id -> snapshot data. Returns [{title, body}]."""
        raise NotImplementedError


class FallbackInsights(InsightProvider):
    """Rule-based insights derived from the user's synced snapshots."""

    is_live = False

    def generate(self, context: dict) -> list[dict]:
        out: list[dict] = []

        spotify = context.get("spotify")
        if spotify:
            out.append(
                {
                    "title": "On repeat",
                    "body": f"You keep coming back to {spotify.get('track')} by {spotify.get('artist')}.",
                }
            )
        travel = context.get("travel")
        if travel:
            out.append(
                {
                    "title": "Wanderlust",
                    "body": f"Your last trip to {travel.get('place')} covered "
                    f"{travel.get('distanceKm')} km over {travel.get('daysSpent')} days.",
                }
            )
        today = context.get("today")
        if today and today.get("nextEvent"):
            out.append(
                {
                    "title": "Coming up",
                    "body": f"{today.get('nextEvent')} is next on your calendar.",
                }
            )
        memory = context.get("memory")
        if memory and memory.get("memories"):
            first = memory["memories"][0]
            out.append(
                {
                    "title": "On this day",
                    "body": f"A year ago: {first.get('title')}.",
                }
            )

        if not out:
            out.append(
                {
                    "title": "Getting to know you",
                    "body": "Connect a few sources and Luma will start finding patterns.",
                }
            )
        return out[:4]


class OpenAIInsights(InsightProvider):
    is_live = True

    def __init__(self, api_key: str, model: str = "gpt-4o-mini") -> None:
        self.api_key = api_key
        self.model = model

    def generate(self, context: dict) -> list[dict]:
        import httpx

        prompt = (
            "Given this JSON of a person's recent activity, return 3-4 short, warm, "
            "specific insights as a JSON array of {title, body}. Be concrete, never "
            "generic.\n\n" + json.dumps(context)
        )
        res = httpx.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
            },
            timeout=30,
        )
        res.raise_for_status()
        content = res.json()["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        items = parsed if isinstance(parsed, list) else parsed.get("insights", [])
        return items[:4]


def get_insight_provider() -> InsightProvider:
    if settings.openai_api_key:
        return OpenAIInsights(settings.openai_api_key)
    return FallbackInsights()
