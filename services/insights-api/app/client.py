from elasticsearch import AsyncElasticsearch

from .config import settings

_client: AsyncElasticsearch | None = None


def _build_auth() -> tuple[str, str] | None:
    if settings.elasticsearch_user and settings.elasticsearch_password:
        return (settings.elasticsearch_user, settings.elasticsearch_password)
    return None


async def connect() -> None:
    global _client
    if _client:
        return
    _client = AsyncElasticsearch(
        settings.elasticsearch_url,
        basic_auth=_build_auth(),
        verify_certs=False,
    )


async def disconnect() -> None:
    global _client
    if _client:
        await _client.close()
        _client = None


def get_client() -> AsyncElasticsearch:
    if not _client:
        raise RuntimeError("Elasticsearch client is not initialized")
    return _client
