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
    the search wiring without any API key."""

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


class GeminiEmbedding(EmbeddingProvider):
    """Real embeddings via Google's Generative Language API (text-embedding-004)."""

    name = "gemini"
    is_live = True

    def __init__(self, api_key: str, model: str) -> None:
        self.api_key = api_key
        self.model = model

    def embed(self, text: str) -> list[float]:
        import httpx

        res = httpx.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:embedContent",
            params={"key": self.api_key},
            json={
                "model": f"models/{self.model}",
                "content": {"parts": [{"text": text}]},
            },
            timeout=20,
        )
        res.raise_for_status()
        return res.json()["embedding"]["values"]


def get_embedding_provider() -> EmbeddingProvider:
    if settings.gemini_api_key:
        return GeminiEmbedding(settings.gemini_api_key, settings.gemini_embedding_model)
    return FallbackEmbedding(settings.embedding_dim)
