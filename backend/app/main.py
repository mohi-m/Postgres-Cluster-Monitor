import os
import time
import asyncio
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
import asyncpg
from datetime import datetime
from . import db

app = FastAPI()

PRIMARY = os.getenv("PRIMARY_HOST")
SECONDARY1 = os.getenv("SECONDARY1_HOST")
SECONDARY2 = os.getenv("SECONDARY2_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")


class NodeStatus(BaseModel):
    host: str
    up: bool
    latency_ms: float | None


@app.on_event("startup")
async def startup_event():
    await db.init_pools()


@app.on_event("shutdown")
async def shutdown_event():
    await db.close_pools()


async def check_node(host: str, timeout: float = 3.0) -> NodeStatus:
    start = time.perf_counter()
    try:
        conn = await asyncio.wait_for(
            asyncpg.connect(
                host=host,
                port=5432,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
            ),
            timeout=timeout,
        )
        await conn.execute("SELECT 1")
        await conn.close()
        latency = (time.perf_counter() - start) * 1000.0
        return NodeStatus(host=host, up=True, latency_ms=round(latency, 2))
    except Exception:
        return NodeStatus(host=host, up=False, latency_ms=None)


@app.get("/health", response_model=List[NodeStatus])
async def health():
    hosts = [PRIMARY, SECONDARY1, SECONDARY2]
    tasks = [check_node(h) for h in hosts]
    results = await asyncio.gather(*tasks)
    return results


def _convert_row(rec: asyncpg.Record) -> dict:
    # convert open_time to ISO; support ms or seconds heuristics
    ot = rec.get("open_time")
    if ot is None:
        ts = None
    else:
        if ot > 1e12:
            ts = datetime.utcfromtimestamp(ot / 1000.0).isoformat() + "Z"
        else:
            ts = datetime.utcfromtimestamp(ot).isoformat() + "Z"

    return {
        "open_time": ts,
        "open": rec.get("open"),
        "high": rec.get("high"),
        "low": rec.get("low"),
        "close": rec.get("close"),
        "volume": rec.get("volume"),
    }


@app.get("/data")
async def get_data(limit: int = 500):
    rows = await db.fetch_latest(limit)
    data = [_convert_row(r) for r in rows]
    return {"count": len(data), "data": data}
