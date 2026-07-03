from fastapi import APIRouter, Query

from app.api.deps import CurrentUser, DbSession
from app.schemas.search import SearchResponse, SearchResult
from app.services import search_service

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchResponse)
async def search(
    user: CurrentUser,
    db: DbSession,
    q: str = Query(min_length=1),
    kind: str | None = None,
) -> SearchResponse:
    results = await search_service.search(db, user.id, q, kind=kind)
    return SearchResponse(
        query=q, results=[SearchResult(**r) for r in results]
    )
