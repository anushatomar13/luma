from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.core.security import create_access_token
from app.schemas.token import AuthResponse
from app.schemas.user import UserCreate, UserLogin, UserRead
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
async def register(payload: UserCreate, db: DbSession) -> AuthResponse:
    try:
        user = await auth_service.register(
            db, email=payload.email, password=payload.password, name=payload.name
        )
    except auth_service.AuthError as err:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(err))
    return AuthResponse(
        access_token=create_access_token(user.id),
        user=UserRead.model_validate(user),
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLogin, db: DbSession) -> AuthResponse:
    try:
        user = await auth_service.authenticate(
            db, email=payload.email, password=payload.password
        )
    except auth_service.AuthError as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(err)
        )
    return AuthResponse(
        access_token=create_access_token(user.id),
        user=UserRead.model_validate(user),
    )


@router.get("/me", response_model=UserRead)
async def me(user: CurrentUser) -> UserRead:
    return UserRead.model_validate(user)
