from pydantic import BaseModel


class SearchResult(BaseModel):
    widget_id: str
    text: str
    score: float


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
