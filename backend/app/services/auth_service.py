from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.services import user_service


class AuthError(Exception):
    """Raised for auth failures (duplicate email, bad credentials)."""


async def register(
    db: AsyncSession, *, email: str, password: str, name: str = ""
) -> User:
    if await user_service.get_by_email(db, email):
        raise AuthError("Email already registered")
    return await user_service.create_user(
        db, email=email, name=name, hashed_password=hash_password(password)
    )


async def authenticate(db: AsyncSession, *, email: str, password: str) -> User:
    user = await user_service.get_by_email(db, email)
    if not user or not user.hashed_password:
        raise AuthError("Invalid email or password")
    if not verify_password(password, user.hashed_password):
        raise AuthError("Invalid email or password")
    return user
