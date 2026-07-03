from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, health, oauth, spotify
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Backend for Luma — the AI personal life dashboard.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix="/api")
    app.include_router(auth.router, prefix=settings.api_v1_prefix)
    app.include_router(oauth.router, prefix=settings.api_v1_prefix)
    app.include_router(spotify.router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
