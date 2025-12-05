import os
import asyncio
import asyncpg
from itertools import cycle

PG_HOST = os.getenv("PGBOUNCER_HOST", "pgbouncer")
PG_PORT = int(os.getenv("PGBOUNCER_PORT", "6432"))
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

# database names as exposed by pgbouncer
DB_READ_NAMES = [
    "bitcoin_read_1",
    "bitcoin_read_2",
]

DB_WRITE_NAME = "bitcoin_write"

_read_pools = {}
_write_pool = None
_read_cycle = cycle(DB_READ_NAMES)


async def init_pools():
    global _read_pools, _write_pool
    max_retries = 5
    retry_delay = 2

    for name in DB_READ_NAMES:
        dsn = f"postgresql://{DB_USER}:{DB_PASSWORD}@{PG_HOST}:{PG_PORT}/{name}"
        for attempt in range(max_retries):
            try:
                _read_pools[name] = await asyncpg.create_pool(
                    dsn, min_size=1, max_size=10, statement_cache_size=0
                )
                break
            except Exception as e:
                if attempt < max_retries - 1:
                    print(
                        f"Pool init for {name} failed (attempt {attempt+1}/{max_retries}), retrying in {retry_delay}s: {e}"
                    )
                    await asyncio.sleep(retry_delay)
                else:
                    raise

    dsn_write = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{PG_HOST}:{PG_PORT}/{DB_WRITE_NAME}"
    )
    for attempt in range(max_retries):
        try:
            _write_pool = await asyncpg.create_pool(
                dsn_write, min_size=1, max_size=10, statement_cache_size=0
            )
            break
        except Exception as e:
            if attempt < max_retries - 1:
                print(
                    f"Write pool init failed (attempt {attempt+1}/{max_retries}), retrying in {retry_delay}s: {e}"
                )
                await asyncio.sleep(retry_delay)
            else:
                raise


async def close_pools():
    for p in _read_pools.values():
        await p.close()
    if _write_pool:
        await _write_pool.close()


def _pick_read_pool():
    name = next(_read_cycle)
    return _read_pools[name]


async def fetch_latest(limit: int = 500):
    pool = _pick_read_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            f"SELECT * FROM public.data_bitcoin ORDER BY open_time DESC LIMIT {limit}"
        )
        return rows
