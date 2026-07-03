from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, user_id: str) -> User | None:
    return await db.get(User, user_id)


async def create_user(
    db: AsyncSession,
    *,
    email: str,
    name: str = "",
    hashed_password: str | None = None,
    oauth_provider: str | None = None,
    oauth_sub: str | None = None,
) -> User:
    user = User(
        email=email,
        name=name,
        hashed_password=hashed_password,
        oauth_provider=oauth_provider,
        oauth_sub=oauth_sub,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
