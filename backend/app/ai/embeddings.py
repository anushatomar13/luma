import hashlib
import math

from app.core.config import settings


class EmbeddingProvider:
    name = "base"
    is_live = False

    def embed(self, text: str) -> list[float]:
        raise NotImplementedError


class FallbackEmbedding(EmbeddingProvider):
    """Deterministic, dependency-free embedding via feature hashing. Not
    semantically rich, but stable — enough to exercise the vector pipeline and
    the search wiring (Phase 7) without downloading models."""

    name = "fallback"
    is_live = False

    def __init__(self, dim: int = 256) -> None:
        self.dim = dim

    def embed(self, text: str) -> list[float]:
        vec = [0.0] * self.dim
        for token in text.lower().split():
            h = int(hashlib.md5(token.encode()).hexdigest(), 16)
            vec[h % self.dim] += 1.0 if (h >> 8) % 2 == 0 else -1.0
        norm = math.sqrt(sum(v * v for v in vec)) or 1.0
        return [v / norm for v in vec]


class OpenAIEmbedding(EmbeddingProvider):
    name = "openai"
    is_live = True

    def __init__(self, api_key: str, model: str = "text-embedding-3-small") -> None:
        self.api_key = api_key
        self.model = model

    def embed(self, text: str) -> list[float]:
        import httpx

        res = httpx.post(
            "https://api.openai.com/v1/embeddings",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"model": self.model, "input": text},
            timeout=20,
        )
        res.raise_for_status()
        return res.json()["data"][0]["embedding"]


def get_embedding_provider() -> EmbeddingProvider:
    if settings.openai_api_key:
        return OpenAIEmbedding(settings.openai_api_key)
    return FallbackEmbedding(settings.embedding_dim)
