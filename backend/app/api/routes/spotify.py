import datetime as dt

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import RedirectResponse

from app.api.deps import CurrentUser, CurrentUserOptional, DbSession
from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.schemas.spotify import ConnectionStatus, SpotifyWidgetData
from app.services import connection_service, spotify_service

router = APIRouter(prefix="/spotify", tags=["spotify"])

_PROVIDER = "spotify"


@router.get("/connect")
async def connect(user: CurrentUser) -> dict[str, str]:
    """Return the Spotify authorize URL. `state` carries a short-lived token that
    ties the callback back to this user."""
    if not settings.spotify_configured:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Spotify is not configured",
        )
    state = create_access_token(user.id, expires_minutes=10)
    return {"url": spotify_service.build_authorize_url(state)}


@router.get("/callback")
async def callback(code: str, state: str, db: DbSession) -> RedirectResponse:
    if not settings.spotify_configured:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Spotify is not configured",
        )
    user_id = decode_access_token(state)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state"
        )
    tokens = await spotify_service.exchange_code(code)
    await connection_service.upsert(
        db,
        user_id=user_id,
        provider=_PROVIDER,
        access_token=tokens["access_token"],
        refresh_token=tokens.get("refresh_token"),
        expires_at=spotify_service.expires_at(tokens.get("expires_in", 3600)),
    )
    return RedirectResponse(f"{settings.frontend_url}/dashboard?spotify=connected")


@router.get("/status", response_model=ConnectionStatus)
async def status_(user: CurrentUser, db: DbSession) -> ConnectionStatus:
    conn = await connection_service.get(db, user.id, _PROVIDER)
    return ConnectionStatus(provider=_PROVIDER, connected=conn is not None)


@router.get("/widget", response_model=SpotifyWidgetData)
async def widget(user: CurrentUserOptional, db: DbSession) -> SpotifyWidgetData:
    """Live data when the caller is authenticated and connected; demo data
    otherwise (or on any upstream error) so the widget always renders."""
    if not (user and settings.spotify_configured):
        return spotify_service.demo_widget_data()

    conn = await connection_service.get(db, user.id, _PROVIDER)
    if conn is None:
        return spotify_service.demo_widget_data()

    try:
        access_token = conn.access_token
        # Refresh if expired.
        if (
            conn.expires_at
            and conn.refresh_token
            and conn.expires_at <= dt.datetime.now(dt.timezone.utc)
        ):
            refreshed = await spotify_service.refresh_access_token(conn.refresh_token)
            access_token = refreshed["access_token"]
            await connection_service.upsert(
                db,
                user_id=user.id,
                provider=_PROVIDER,
                access_token=access_token,
                expires_at=spotify_service.expires_at(
                    refreshed.get("expires_in", 3600)
                ),
            )
        return await spotify_service.fetch_widget_data(access_token)
    except Exception:
        return spotify_service.demo_widget_data()
