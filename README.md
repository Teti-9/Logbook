# Logbook

Full-stack training logbook for creating workout plans, organizing weekly divisions, recording top sets, and retaining a progression history.

## What it does

- Organizes **workouts** into daily **divisions**.
- Registers exercises with target muscle group, series and reps, rest interval, optional `backoff` technique, and notes.
- Records a top set (`topset_weight` and `topset_reps`) plus optional notes.
- Create and sync logbook entries into a permanent history record.
- Keeps users' data isolated through Better Auth sessions.

## Stack

- Node.js (ES modules) and Express 5
- Prisma 7 and PostgreSQL
- Better Auth with the Prisma adapter
- BullMQ and Redis for background jobs (async logbook synchronization)
- An **MCP server** exposing the API as tools for AI clients
- React 19, Vite, and Tailwind CSS
- OpenAPI/Swagger UI, Vitest, Supertest, and Docker

## Domain model

```text
User
└─ Workout (name, observation?)
   └─ Division (name, day, workoutId)
      └─ Exercise (name, target_muscle_group, series_reps, rest,
                   advanced_technique?, observation?)
         ├─ Logbook (topset_weight, topset_reps, extra?, sync)
         └─ Historical (previous_topset_weight, previous_topset_reps, extra?)
```

`day` must be one of `monday` through `sunday`. Each user can have only one active division per day. Deletions of workouts, divisions, exercises, logbook entries, and history entries are soft deletions.

## Run with Docker

Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://user:password@database:5432/logbook"
POSTGRES_USER="user"
POSTGRES_PASS="password"
POSTGRES_DB="logbook"
BETTER_AUTH_URL="http://localhost:8000"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
REDIS_PASSWORD="replace-with-a-redis-password"
```

Then start the stack:

```bash
docker compose up --build
```

This brings up five services: `database` (PostgreSQL), `redis`, `app` (the API, running migrations on boot), `worker` (the BullMQ job processor), and `frontend`.

- API: `http://localhost:8000/api`
- Interactive API documentation: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`

## Background jobs

Logbook synchronization runs asynchronously through a BullMQ queue backed by Redis:

- `src/queue.js` defines the shared `Queue` instance.
- `src/lib/worker.js` is the worker process (`npm run worker`) that consumes `taskSync` jobs and hands them to `src/jobs/syncJob.js`, which calls `src/utils/syncBook.js` to move a logbook entry into history and mark it synced.
- `POST /api/synclogbooks` enqueues one job per exercise instead of syncing inline, and returns immediately.
- `GET /api/logbooksjobs/:jobId` polls a job's state (and its failure reason or return value once finished).
- `npm run clearQueue` runs `src/utils/cleanQueue.js` to purge the queue.

## MCP server

`src/mcpServer/server.js` exposes the API as tools over stdio for MCP-compatible AI clients (`@modelcontextprotocol/sdk`/`server`). It registers create, get, and delete tools (`src/mcpServer/tools/`) for workouts, divisions, exercises, logbooks, and historicals, plus `sync_logbooks` and `get_logbookJob` for the async sync flow.

The server authenticates to the API itself: `src/mcpServer/utils/apiRequest.js` signs in with `EMAIL`/`PASSWORD` against `API_BASE` (Better Auth's `/auth/sign-in/email`), caches the session cookie, and retries once on a 401. Set these in the MCP server's environment:

```env
API_BASE="http://localhost:8000/api"
EMAIL="user@example.com"
PASSWORD="user-password"
ORIGIN="http://localhost:8000"
```

## Authentication

Authentication is provided by **Better Auth**, not by the legacy JWT/refresh-token implementation (Code still available).

1. Register with `POST /api/auth/sign-up/email` using `name`, `email`, and `password`.
2. Sign in with `POST /api/auth/sign-in/email` using `email` and `password`.
3. Better Auth sets an HTTP-only session cookie. Browser clients must send requests with `credentials: "include"`.
4. Protected API routes identify the user from that cookie. Do **not** send `Authorization: Bearer ...` headers.
5. Use `GET /api/auth/get-session` to read the session and `POST /api/auth/sign-out` to end it.

The React client uses `better-auth/react` through `frontend/src/auth-client.js`; prefer it over calling the Better Auth routes by hand.

## API overview

All application routes are under `/api` and require a Better Auth session cookie:

| Resource  | Routes                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| Workouts  | `GET`, `POST /api/workouts`; `GET`, `DELETE /api/workouts/:id`                                                           |
| Divisions | `GET`, `POST /api/divisions`; `GET`, `DELETE /api/divisions/:id`                                                         |
| Exercises | `GET`, `POST /api/exercises`; `GET`, `DELETE /api/exercises/:id`                                                         |
| Logbook   | `GET`, `POST /api/logbooks`; `GET`, `DELETE /api/logbooks/:id`; `POST /api/synclogbooks`; `GET /api/logbooksjobs/:jobId` |
| History   | `GET /api/historicals`; `GET`, `DELETE /api/historicals/:id`                                                             |

The list endpoints for workouts, divisions, and exercises support `page` and `limit`. History supports an optional `search` parameter for an exercise name.

`POST /api/synclogbooks` takes a body of `{ "exercises": [exerciseId, ...] }`, enqueues one BullMQ job per exercise, and returns immediately with a confirmation message. Poll `GET /api/logbooksjobs/:jobId` (the BullMQ job id) to check whether a sync finished, failed, or is still pending.

Create a division only after its workout exists: the request body must include `workoutId`. Use the exact field names in the OpenAPI docs—especially `target_muscle_group`, `series_reps`, `topset_weight`, `topset_reps`, `advanced_technique?` and `observation?`

## Response envelope

Application routes use this envelope:

```json
{
  "success": true,
  "data": {}
}
```

Errors use `success: false` and put the message in `data`. Better Auth routes return Better Auth's own response format.

## Tests

```bash
npm test
```

## Project structure

```text
src/
  config/infra/   # database, Better Auth, and Redis setup
  jobs/           # BullMQ job handlers (e.g. syncJob.js)
  lib/            # worker.js, the BullMQ worker process
  mcpServer/      # MCP server + tools exposing the API to AI clients
  middleware/     # session and error handling
  repositories/   # Prisma persistence
  routes/         # HTTP handlers
  services/       # domain logic
  schemas/        # zod error validation
  utils/          # syncBook.js, cleanQueue.js, token helpers
  queue.js        # shared BullMQ Queue instance
  openApi.js      # source of truth for Swagger UI
frontend/src/
  auth-client.js  # Better Auth React client
  components/
  services/
prisma/
```
