from datetime import date
from typing import Any

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    elasticsearch: str


class TopSpenderItem(BaseModel):
    developerId: str
    totalTokens: int
    projects: list[str]


class TopSpendersResponse(BaseModel):
    items: list[TopSpenderItem]


class DailyTrendPoint(BaseModel):
    date: date
    tokensIn: int
    tokensOut: int


class DailyTrendResponse(BaseModel):
    points: list[DailyTrendPoint]


class AlertItem(BaseModel):
    severity: str
    message: str
    projectId: str
    developerId: str
    payload: dict[str, Any]


class AlertsResponse(BaseModel):
    alerts: list[AlertItem]
