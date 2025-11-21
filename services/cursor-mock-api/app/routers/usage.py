from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Query

from ..db import get_db
from ..schemas import EventsResponse, UsageSummaryResponse, EventItem, DeveloperUsage

router = APIRouter(prefix="/v1", tags=["usage"])


WINDOW_MAP = {
    "24h": timedelta(hours=24),
    "7d": timedelta(days=7),
    "30d": timedelta(days=30),
}


def _serialize_event(doc: dict) -> EventItem:
    return EventItem(
        eventId=doc.get("eventId"),
        projectId=doc.get("projectId"),
        developerId=doc.get("developerId"),
        ide=doc.get("ide"),
        eventType=doc.get("eventType"),
        promptTokens=doc.get("promptTokens", 0),
        completionTokens=doc.get("completionTokens", 0),
        timestamp=doc.get("timestamp"),
        metadata=doc.get("metadata"),
    )


@router.get("/projects/{project_id}/events", response_model=EventsResponse)
async def list_events(
    project_id: str,
    limit: int = Query(50, ge=1, le=200),
    eventType: str | None = Query(None, description="Filter by event type"),
) -> EventsResponse:
    db = get_db()
    query: dict[str, object] = {"projectId": project_id}
    if eventType:
        query["eventType"] = eventType

    cursor = (
        db["events"]
        .find(query)
        .sort("timestamp", -1)
        .limit(limit)
    )
    items = [_serialize_event(doc) async for doc in cursor]
    return EventsResponse(projectId=project_id, items=items)


@router.get("/projects/{project_id}/usage/summary", response_model=UsageSummaryResponse)
async def usage_summary(
    project_id: str,
    window: str = Query("7d", pattern="^(24h|7d|30d)$"),
) -> UsageSummaryResponse:
    db = get_db()
    duration = WINDOW_MAP.get(window)
    if not duration:
        raise HTTPException(status_code=400, detail="Invalid window")

    since = datetime.utcnow() - duration
    pipeline = [
        {"$match": {"projectId": project_id, "timestamp": {"$gte": since}}},
        {
            "$group": {
                "_id": "$developerId",
                "events": {"$sum": 1},
                "tokensIn": {"$sum": "$promptTokens"},
                "tokensOut": {"$sum": "$completionTokens"},
            }
        },
        {"$sort": {"tokensOut": -1}},
    ]

    cursor = db["events"].aggregate(pipeline)
    developers = [
        DeveloperUsage(
            developerId=doc["_id"],
            events=doc.get("events", 0),
            tokensIn=doc.get("tokensIn", 0),
            tokensOut=doc.get("tokensOut", 0),
        )
        async for doc in cursor
    ]
    return UsageSummaryResponse(projectId=project_id, window=window, developers=developers)
