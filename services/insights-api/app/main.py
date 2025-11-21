from fastapi import FastAPI

from .client import connect, disconnect, get_client
from .routers import insights
from .schemas import HealthResponse

app = FastAPI(title="Insights API", version="0.1.0")
app.include_router(insights.router)


@app.on_event("startup")
async def startup_event() -> None:
    await connect()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await disconnect()


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    client = get_client()
    await client.ping()
    return HealthResponse(status="ok", elasticsearch="connected")
