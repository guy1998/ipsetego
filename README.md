# ipsetego

A self-hosted portfolio platform: users sign up, build a public portfolio (projects, experience, certifications, CV), and visitors can chat with an LLM-powered assistant that answers questions using that portfolio's data. Includes a separate admin panel for user management.

**Stack**: Express + Sequelize (Postgres) backend, two Vite/React frontends (`client` — the public app, `admin-client` — the admin panel), Supabase Storage for file uploads, and a pluggable LLM backend (Ollama or any OpenAI-compatible API).

## Running with Docker (recommended)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### 1. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in, at minimum:

| Variable | Required for | Notes |
|---|---|---|
| `JWT_KEY` | the app to start | any long random string |
| `ENCRYPTION_KEY` | the app to start | exactly 64 hex chars — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET_NAME` | the app to start | the backend fails to boot without these — create a free [Supabase](https://supabase.com) project and storage bucket |
| `SERVICE_EMAIL`, `SERVICE_PASS` | signup OTPs, password reset, contact form | SMTP account credentials (see note below) |
| `ADMIN_WHITELIST` | admin panel access | comma-separated emails allowed to log into `admin-client` |

Everything else in `.env.example` has a sensible default for local use. `DATABASE_HOST` can stay as `localhost` in the file — `docker-compose.yml` overrides it to reach the database container automatically.

> **SMTP note**: `utils/mailer.js` connects to `smtp.ionos.de`. If you use a different provider (Gmail, SendGrid, etc.), edit the `host` in that file to match — it isn't (yet) an env var.

### 2. Start everything

```bash
docker compose up --build
```

This builds and starts four containers:

| Service | URL | What it is |
|---|---|---|
| `client` | http://localhost:8080 | public app (signup, login, portfolio builder, public portfolio pages) |
| `admin-client` | http://localhost:8081 | admin panel (OTP login, gated by `ADMIN_WHITELIST`) |
| `backend` | http://localhost:1989 | the API — runs pending database migrations automatically on startup |
| `db` | localhost:5432 | Postgres, with a named volume so data survives restarts |

The LLM chat feature needs a provider reachable from the `backend` container:
- **Ollama** (default): run Ollama on your host machine and set `HOST=http://host.docker.internal:11434` in `.env` (the compose file is already configured to let the container resolve `host.docker.internal`).
- **OpenAI-compatible**: set `LLM_PROVIDER=openai` and `OPENAI_API_KEY` in `.env` — no local model needed.

### Rebuilding after changes

```bash
docker compose up --build
```

`client`/`admin-client` bake `VITE_BACKEND_URL` in at *build* time (from `.env`'s `BACKEND_URL`), so if you change `BACKEND_URL` you need to rebuild those two images, not just restart them.

### Stopping

```bash
docker compose down          # stop, keep the database volume
docker compose down -v       # stop and wipe the database volume
```

## Running without Docker

### Prerequisites

- Node.js 20+
- A local Postgres instance
- A Supabase project (for file storage)

### 1. Backend

```bash
npm install
cp .env.example .env   # fill in real values, DATABASE_HOST=localhost is correct here
npm run migrate
npm start               # http://localhost:1989
```

### 2. Public client

```bash
cd client
npm install
cp .env.example .env    # VITE_BACKEND_URL=http://localhost:1989
npm run dev              # http://localhost:8080
```

### 3. Admin client

```bash
cd admin-client
npm install
cp .env.example .env    # VITE_BACKEND_URL=http://localhost:1989
npm run dev              # http://localhost:8081
```

## Admin access

There's no separate admin signup — any email listed in `ADMIN_WHITELIST` (comma-separated, in `.env`) can log into `admin-client` via a one-time code sent to that email. Regular user accounts (created through the public signup flow) never get admin rights, regardless of what's requested in the API — `role` is server-controlled.

## LLM chat feature

Set `LLM_PROVIDER` in `.env`:
- `ollama` (default) — talks to a local/self-hosted [Ollama](https://ollama.com) server. Configure `HOST` and `OLLAMA_MODEL`.
- `openai` — talks to any OpenAI-compatible chat completions API (OpenAI, Groq, Together, a local vLLM server, etc.). Configure `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`.

## Database migrations

```bash
npm run migrate          # apply pending migrations
npm run migrate:undo     # roll back the last migration
npm run makemigrations   # generate a migration from model changes
```

In Docker, migrations run automatically every time the `backend` container starts (`docker-entrypoint.sh`) — safe to re-run, already-applied migrations are skipped.

## License

See [LICENSE](LICENSE).
