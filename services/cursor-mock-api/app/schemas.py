from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class EventItem(BaseModel):
    eventId: str
    projectId: str
    developerId: str
    ide: str
    eventType: str
    promptTokens: int = Field(default=0, ge=0)
    completionTokens: int = Field(default=0, ge=0)
    timestamp: datetime
    metadata: dict[str, Any] | None = None


class EventsResponse(BaseModel):
    projectId: str
    items: list[EventItem]


class DeveloperUsage(BaseModel):
    developerId: str
    events: int
    tokensIn: int
    tokensOut: int


class UsageSummaryResponse(BaseModel):
    projectId: str
    window: str
    developers: list[DeveloperUsage]


class HealthResponse(BaseModel):
    status: str
    mongo: str
