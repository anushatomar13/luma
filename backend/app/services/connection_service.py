import datetime as dt

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.connection import Connection


async def get(db: AsyncSession, user_id: str, provider: str) -> Connection | None:
    result = await db.execute(
        select(Connection).where(
            Connection.user_id == user_id, Connection.provider == provider
        )
    )
    return result.scalar_one_or_none()


async def upsert(
    db: AsyncSession,
    *,
    user_id: str,
    provider: str,
    access_token: str,
    refresh_token: str | None = None,
    expires_at: dt.datetime | None = None,
    external_user_id: str | None = None,
) -> Connection:
    conn = await get(db, user_id, provider)
    if conn is None:
        conn = Connection(user_id=user_id, provider=provider, access_token=access_token)
        db.add(conn)
    conn.access_token = access_token
    if refresh_token is not None:
        conn.refresh_token = refresh_token
    conn.expires_at = expires_at
    if external_user_id is not None:
        conn.external_user_id = external_user_id
    await db.commit()
    await db.refresh(conn)
    return conn
