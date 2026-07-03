"""Spotify integration.

The OAuth + Web API calls are fully implemented but only run when
`spotify_client_id` / `spotify_client_secret` are configured. Until then (and as
a graceful fallback on any error), `demo_widget_data()` keeps the widget alive
with realistic data so the dashboard always looks complete.
"""

import base64
import datetime as dt
from urllib.parse import urlencode

import httpx

from app.core.config import settings
from app.schemas.spotify import SpotifyWidgetData

AUTHORIZE_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
API_BASE = "https://api.spotify.com/v1"


def build_authorize_url(state: str) -> str:
    params = {
        "client_id": settings.spotify_client_id,
        "response_type": "code",
        "redirect_uri": settings.spotify_redirect_uri,
        "scope": settings.spotify_scopes,
        "state": state,
    }
    return f"{AUTHORIZE_URL}?{urlencode(params)}"


def _basic_auth_header() -> dict[str, str]:
    raw = f"{settings.spotify_client_id}:{settings.spotify_client_secret}"
    encoded = base64.b64encode(raw.encode()).decode()
    return {"Authorization": f"Basic {encoded}"}


async def exchange_code(code: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.post(
            TOKEN_URL,
            headers=_basic_auth_header(),
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.spotify_redirect_uri,
            },
        )
        res.raise_for_status()
        return res.json()


async def refresh_access_token(refresh_token: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.post(
            TOKEN_URL,
            headers=_basic_auth_header(),
            data={"grant_type": "refresh_token", "refresh_token": refresh_token},
        )
        res.raise_for_status()
        return res.json()


def expires_at(expires_in: int) -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc) + dt.timedelta(seconds=expires_in)


async def fetch_widget_data(access_token: str) -> SpotifyWidgetData:
    """Fetch now-playing (falling back to most recently played) and normalize."""
    headers = {"Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient(timeout=10) as client:
        now = await client.get(f"{API_BASE}/me/player/currently-playing", headers=headers)
        if now.status_code == 200 and now.json().get("item"):
            payload = now.json()
            item = payload["item"]
            return _normalize(
                item,
                progress_ms=payload.get("progress_ms", 0),
                is_playing=payload.get("is_playing", False),
            )

        recent = await client.get(
            f"{API_BASE}/me/player/recently-played?limit=1", headers=headers
        )
        recent.raise_for_status()
        items = recent.json().get("items", [])
        if not items:
            return demo_widget_data()
        return _normalize(items[0]["track"], progress_ms=0, is_playing=False)


def _normalize(item: dict, *, progress_ms: int, is_playing: bool) -> SpotifyWidgetData:
    artists = item.get("artists", [])
    return SpotifyWidgetData(
        track=item.get("name", "Unknown"),
        artist=artists[0]["name"] if artists else "Unknown",
        album=item.get("album", {}).get("name", ""),
        progress_sec=progress_ms // 1000,
        duration_sec=item.get("duration_ms", 0) // 1000,
        is_playing=is_playing,
        is_live=True,
    )


def demo_widget_data() -> SpotifyWidgetData:
    return SpotifyWidgetData(
        track="Midnight City",
        artist="M83",
        album="Hurry Up, We're Dreaming",
        progress_sec=154,
        duration_sec=241,
        is_playing=True,
        is_live=False,
    )
