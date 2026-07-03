"""Google OAuth. Fully implemented but gated on configured credentials —
set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET to enable. Apple OAuth follows the
same shape and lands alongside real credentials."""

from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException, status

from app.api.deps import DbSession
from app.core.config import settings
from app.core.security import create_access_token
from app.schemas.token import AuthResponse
from app.schemas.user import UserRead
from app.services import user_service

router = APIRouter(prefix="/auth/google", tags=["auth"])

_REDIRECT_PATH = "/auth/callback/google"


def _redirect_uri() -> str:
    return f"{settings.oauth_redirect_base}{_REDIRECT_PATH}"


@router.get("/url")
async def google_authorize_url() -> dict[str, str]:
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured",
        )
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": _redirect_uri(),
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    return {"url": f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"}


@router.get("/callback", response_model=AuthResponse)
async def google_callback(code: str, db: DbSession) -> AuthResponse:
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured",
        )
    async with httpx.AsyncClient(timeout=10) as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": _redirect_uri(),
                "grant_type": "authorization_code",
            },
        )
        token_res.raise_for_status()
        access = token_res.json()["access_token"]
        info_res = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access}"},
        )
        info_res.raise_for_status()
        info = info_res.json()

    user = await user_service.get_by_email(db, info["email"])
    if user is None:
        user = await user_service.create_user(
            db,
            email=info["email"],
            name=info.get("name", ""),
            oauth_provider="google",
            oauth_sub=info["sub"],
        )
    return AuthResponse(
        access_token=create_access_token(user.id),
        user=UserRead.model_validate(user),
    )
