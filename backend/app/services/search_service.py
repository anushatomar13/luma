from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings import get_embedding_provider
from app.models.document import Document

# Blend of semantic (embedding) and keyword (lexical) relevance.
SEMANTIC_WEIGHT = 0.6
KEYWORD_WEIGHT = 0.4


def _dot(a: list[float], b: list[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    # Embeddings are unit-normalized, so the dot product is cosine similarity.
    return sum(x * y for x, y in zip(a, b))


def _keyword_score(query: str, text: str) -> float:
    tokens = [t for t in query.lower().split() if t]
    if not tokens:
        return 0.0
    lowered = text.lower()
    return sum(1 for t in tokens if t in lowered) / len(tokens)


async def search(
    db: AsyncSession,
    user_id: str,
    query: str,
    *,
    kind: str | None = None,
    limit: int = 8,
) -> list[dict]:
    """Hybrid search over the user's embedded documents: semantic similarity +
    lexical overlap, with an optional metadata (kind) filter."""
    stmt = select(Document).where(Document.user_id == user_id)
    if kind:
        stmt = stmt.where(Document.kind == kind)
    docs = (await db.execute(stmt)).scalars().all()
    if not docs:
        return []

    query_embedding = get_embedding_provider().embed(query)

    scored: list[dict] = []
    for doc in docs:
        semantic = max(0.0, _dot(query_embedding, doc.embedding))
        keyword = _keyword_score(query, doc.text)
        score = SEMANTIC_WEIGHT * semantic + KEYWORD_WEIGHT * keyword
        if score > 0:
            scored.append(
                {"widget_id": doc.kind, "text": doc.text, "score": round(score, 4)}
            )

    scored.sort(key=lambda r: r["score"], reverse=True)
    return scored[:limit]
