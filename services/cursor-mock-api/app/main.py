from fastapi import FastAPI

from .config import settings
from .db import connect, disconnect, get_db
from .routers import usage
from .schemas import HealthResponse

app = FastAPI(title="Cursor Mock API", version="0.1.0")
app.include_router(usage.router)


@app.on_event("startup")
async def startup_event() -> None:
    await connect()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await disconnect()


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    db = get_db()
    await db.command("ping")
    return HealthResponse(status="ok", mongo="connected")
