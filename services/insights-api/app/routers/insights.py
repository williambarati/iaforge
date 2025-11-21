from datetime import date, timedelta

from fastapi import APIRouter, Query

from ..client import get_client
from ..config import settings
from ..schemas import (
    AlertsResponse,
    DailyTrendPoint,
    DailyTrendResponse,
    TopSpenderItem,
    TopSpendersResponse,
    AlertItem,
)

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/top-spenders", response_model=TopSpendersResponse)
async def top_spenders(size: int = Query(5, ge=1, le=20)) -> TopSpendersResponse:
    client = get_client()
    response = await client.search(
        index=settings.elastic_index,
        size=0,
        aggs={
            "by_developer": {
                "terms": {"field": "developerId", "size": size, "order": {"total_tokens": "desc"}},
                "aggs": {
                    "total_tokens": {"sum": {"field": "tokensOut"}},
                    "projects": {"terms": {"field": "projectId"}},
                },
            }
        },
    )
    buckets = response["aggregations"]["by_developer"]["buckets"]
    items = [
        TopSpenderItem(
            developerId=bucket["key"],
            totalTokens=int(bucket["total_tokens"]["value"]),
            projects=[p["key"] for p in bucket["projects"]["buckets"]],
        )
        for bucket in buckets
    ]
    return TopSpendersResponse(items=items)


@router.get("/daily-trend", response_model=DailyTrendResponse)
async def daily_trend(days: int = Query(14, ge=1, le=60)) -> DailyTrendResponse:
    client = get_client()
    start_date = date.today() - timedelta(days=days)
    response = await client.search(
        index=settings.elastic_index,
        size=0,
        query={
            "range": {"date": {"gte": start_date.isoformat()}},
        },
        aggs={
            "per_day": {
                "date_histogram": {
                    "field": "date",
                    "calendar_interval": "day",
                },
                "aggs": {
                    "tokens_in": {"sum": {"field": "tokensIn"}},
                    "tokens_out": {"sum": {"field": "tokensOut"}},
                },
            }
        },
    )
    buckets = response["aggregations"]["per_day"]["buckets"]
    points = [
        DailyTrendPoint(
            date=date.fromtimestamp(bucket["key"]/1000),
            tokensIn=int(bucket["tokens_in"]["value"]),
            tokensOut=int(bucket["tokens_out"]["value"]),
        )
        for bucket in buckets
    ]
    return DailyTrendResponse(points=points)


@router.get("/alerts", response_model=AlertsResponse)
async def alerts(threshold: int = Query(4000, ge=1000, le=20000)) -> AlertsResponse:
    client = get_client()
    response = await client.search(
        index=settings.elastic_index,
        size=20,
        query={"range": {"tokensOut": {"gte": threshold}}},
        _source=["projectId", "developerId", "tokensOut", "tokensIn", "date"],
    )
    hits = response["hits"]["hits"]
    alerts = [
        AlertItem(
            severity="warning",
            message=f"{doc['_source']['developerId']} excedeu {threshold} tokens em {doc['_source']['date']}",
            projectId=doc["_source"]["projectId"],
            developerId=doc["_source"]["developerId"],
            payload=doc["_source"],
        )
        for doc in hits
    ]
    return AlertsResponse(alerts=alerts)
