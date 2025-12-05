# Postgres Cluster Monitor (Local)

This project provides a local stack to monitor and stress-test a remote Azure Postgres cluster.

Features:

- pgBouncer in front of the remote Azure nodes (templates filled at container startup)
- FastAPI backend exposing `/health` and `/data`
- Locust for load testing (web UI on port 8089)
- React + Vite frontend (status dashboard, data visualizer, and embedded Locust UI)

Quickstart

1. Copy `.env.example` to `.env` and fill `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and the three host IPs.
2. Run:

```powershell
docker-compose up --build
```

Services:

- `pgbouncer` : 6432
- `backend` : 8000
- `locust` : 8089
- `frontend` : 5173

Notes

- `pgbouncer/pgbouncer.ini.template` and `userlist.txt.template` use environment variables from `.env` and are processed at container start.
- The backend connects to `pgbouncer` and rotates reads across `bitcoin_read_1` and `bitcoin_read_2` entries in the pgbouncer databases mapping.