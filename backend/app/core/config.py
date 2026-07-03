from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, overridable via environment / `.env`."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "Luma API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"

    # Database — async SQLite by default (no infra needed for dev); Postgres in prod.
    # e.g. prod: postgresql+asyncpg://user:pass@host:5432/luma
    database_url: str = "sqlite+aiosqlite:///./luma.db"

    # Auth
    secret_key: str = "dev-secret-change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # CORS — the Next.js frontend origin(s)
    cors_origins: list[str] = ["http://localhost:3000"]

    # OAuth (optional — email/password auth works without these configured)
    google_client_id: str | None = None
    google_client_secret: str | None = None
    oauth_redirect_base: str = "http://localhost:3000"

    # Frontend origin (post-OAuth redirects land here)
    frontend_url: str = "http://localhost:3000"

    # Spotify integration (optional — the widget serves demo data until configured)
    spotify_client_id: str | None = None
    spotify_client_secret: str | None = None
    spotify_redirect_uri: str = "http://localhost:8000/api/v1/spotify/callback"
    spotify_scopes: str = (
        "user-read-currently-playing user-read-recently-played user-top-read"
    )

    @property
    def spotify_configured(self) -> bool:
        return bool(self.spotify_client_id and self.spotify_client_secret)

    @property
    def google_configured(self) -> bool:
        return bool(self.google_client_id and self.google_client_secret)

    # Background jobs — Redis broker in prod; without it Celery runs eagerly
    # (in-process, synchronous) so the pipeline works with zero extra infra.
    redis_url: str | None = None

    @property
    def celery_always_eager(self) -> bool:
        return self.redis_url is None

    # AI (optional — a deterministic local fallback runs without any of these)
    openai_api_key: str | None = None
    gemini_api_key: str | None = None
    qdrant_url: str | None = None
    embedding_dim: int = 256

    @property
    def ai_configured(self) -> bool:
        return bool(self.openai_api_key or self.gemini_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
