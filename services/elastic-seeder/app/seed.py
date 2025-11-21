import asyncio
import json
from pathlib import Path

import httpx

from .config import settings


MAPPING = {
    "mappings": {
        "properties": {
            "usageId": {"type": "keyword"},
            "projectId": {"type": "keyword"},
            "developerId": {"type": "keyword"},
            "date": {"type": "date", "format": "strict_date"},
            "tokensIn": {"type": "integer"},
            "tokensOut": {"type": "integer"},
            "totalCostUsd": {"type": "double"},
        }
    }
}


async def wait_for_elastic(client: httpx.AsyncClient) -> None:
    for _ in range(30):
        try:
            response = await client.get("/_cluster/health")
            if response.is_success:
                print("Elasticsearch disponível")
                return
        except httpx.HTTPError:
            pass
        await asyncio.sleep(2)
    raise RuntimeError("Elasticsearch não respondeu a tempo")


def load_seed_data(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


async def recreate_index(client: httpx.AsyncClient) -> None:
    await client.delete(f"/{settings.elastic_index}", params={"ignore_unavailable": "true"})
    response = await client.put(f"/{settings.elastic_index}", json=MAPPING)
    response.raise_for_status()


def build_bulk_payload(records: list[dict]) -> str:
    lines: list[str] = []
    for record in records:
        meta = {"index": {"_index": settings.elastic_index, "_id": record["usageId"]}}
        lines.append(json.dumps(meta))
        lines.append(json.dumps(record))
    return "\n".join(lines) + "\n"


async def bulk_insert(client: httpx.AsyncClient, payload: str) -> None:
    response = await client.post("/_bulk", content=payload, headers={"Content-Type": "application/x-ndjson"})
    response.raise_for_status()
    result = response.json()
    if result.get("errors"):
        raise RuntimeError("Falha ao inserir documentos no Elasticsearch")


async def main() -> None:
    data = load_seed_data(settings.seed_file)
    async with httpx.AsyncClient(base_url=settings.elasticsearch_url, timeout=10.0) as client:
        await wait_for_elastic(client)
        await recreate_index(client)
        payload = build_bulk_payload(data)
        await bulk_insert(client, payload)
    print(f"Carregados {len(data)} documentos em {settings.elastic_index}")


if __name__ == "__main__":
    asyncio.run(main())
