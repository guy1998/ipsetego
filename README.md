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
| `SMTP_HOST`, `SERVICE_EMAIL`, `SERVICE_PASS` | signup OTPs, password reset, contact form | any SMTP account (Gmail, IONOS, SendGrid, etc.) — see `SMTP_*` vars below |
| `ADMIN_WHITELIST` | admin panel access | comma-separated emails allowed to log into `admin-client` |

Everything else in `.env.example` has a sensible default for local use. `DATABASE_HOST` can stay as `localhost` in the file — `docker-compose.yml` overrides it to reach the database container automatically.

**SMTP config**: `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` point at your provider, `SERVICE_EMAIL` / `SERVICE_PASS` are the account credentials, and `SMTP_FROM` is the "from" address on outgoing mail (defaults to `SERVICE_EMAIL`). Leave `SMTP_SECURE=true` for implicit-TLS ports like 465; set it to `false` for STARTTLS ports like 587.

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

## Published images (GitHub Actions → GHCR)

`.github/workflows/docker-publish.yml` builds and pushes three images to the
GitHub Container Registry on every push to `main` (and on `v*` tags):

| Image | Built from |
|---|---|
| `ghcr.io/guy1998/ipsetego-backend` | `./Dockerfile` |
| `ghcr.io/guy1998/ipsetego-client` | `./client/Dockerfile` |
| `ghcr.io/guy1998/ipsetego-admin-client` | `./admin-client/Dockerfile` |

Tags: `latest` (default branch), `sha-<short>` for every commit, and `1.2.3` /
`1.2` for `v*` git tags. No secrets to configure — the workflow authenticates
with the built-in `GITHUB_TOKEN`.

The two frontends inline `VITE_BACKEND_URL` at **build** time, so the workflow
bakes in `https://api.ipsetego.com`. To point the published images at a
different API, add a repository variable named `VITE_BACKEND_URL`
(Settings → Secrets and variables → Actions → Variables) and re-run the workflow.

## Deploying to a server with HTTPS

This stack is designed to share a server with other apps. One
[Caddy](https://caddyserver.com) container at the root of the server owns ports
80 and 443, terminates TLS for every app on the box, and obtains and renews
Let's Encrypt certificates automatically. Each app is a self-contained Compose
project that publishes **no** ports at all — it joins a shared Docker network
called `edge` and contributes one site file to the proxy.

```
/opt/stacks/
├── docker-compose.yml      # the shared Caddy — see step 3
├── Caddyfile               # global options + `import sites/*.caddy`
├── sites/
│   ├── busulla.caddy       # one site file per app
│   └── ipsetego.caddy      # this app's three hostnames — see step 6
├── busulla/
│   ├── docker-compose.yml
│   └── .env
└── ipsetego/               # this repo
    ├── docker-compose.prod.yml
    └── .env
```

Adding an app later means three things and never touching another app: attach
its public services to `edge`, drop an `<app>.caddy` into `sites/`, and reload
Caddy. Reloading is graceful — running sites keep serving while the new
certificate is fetched.

| Domain | Serves | Upstream alias |
|---|---|---|
| `ipsetego.com` (+ `www` → apex redirect) | `client` | `ipsetego-client:80` |
| `app.ipsetego.com` | `admin-client` | `ipsetego-admin:80` |
| `api.ipsetego.com` | `backend` | `ipsetego-backend:1989` |

Those aliases are declared in `docker-compose.prod.yml` and consumed by the
proxy's `sites/ipsetego.caddy`. They're prefixed on purpose: Compose also registers the
bare service name (`backend`, `client`) on every network a service joins, and on
a shared network two apps would collide on those. Prefixed aliases are
unambiguous, so every new app should follow the same convention.

The API needs its own hostname because auth cookies are issued with
`Secure; SameSite=None` — both frontends can talk to it cross-origin, but
everything must be HTTPS.

### 1. DNS (IONOS)

In the IONOS control panel: **Domains & SSL → ipsetego.com → DNS**. Delete any
parking/forwarding records IONOS created, then add A records pointing at your
Contabo server's IPv4:

| Type | Host | Value |
|---|---|---|
| A | `@` | `<contabo-ipv4>` |
| A | `www` | `<contabo-ipv4>` |
| A | `app` | `<contabo-ipv4>` |
| A | `api` | `<contabo-ipv4>` |

Add matching `AAAA` records if your server has IPv6. If a `CAA` record exists,
make sure it allows `letsencrypt.org`, or delete it. Wait until
`dig +short ipsetego.com` returns your server IP **before** loading the site
file — Caddy fails the certificate challenge otherwise.

### 2. Prepare the server

```bash
ssh root@<contabo-ipv4>

# Docker
curl -fsSL https://get.docker.com | sh

# Firewall — 80/443 must be open for Let's Encrypt and for the apps
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
```

Contabo also has a firewall in its own customer panel on some plans — if yours
does, open 80 and 443 there too.

### 3. Set up the shared proxy (once per server)

Skip to step 4 if the root `docker-compose.yml` and `Caddyfile` are already
there from a previous app.

The proxy is server infrastructure, not part of this repo — these two files are
written by hand, once, and then shared by every app on the box.

```bash
docker network create edge
mkdir -p /opt/stacks/sites && cd /opt/stacks
```

`/opt/stacks/docker-compose.yml`:

```yaml
name: edge

services:
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp" # HTTP/3
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./sites:/etc/caddy/sites:ro
      # Certificates and the ACME account key. Deleting this volume means
      # re-issuing everything from scratch, which is rate limited — keep it.
      - caddy-data:/data
      - caddy-config:/config
    networks:
      - edge

networks:
  edge:
    external: true

volumes:
  caddy-data:
  caddy-config:
```

`/opt/stacks/Caddyfile` — global options only, so adding or removing an app
never means editing it:

```
{
	email you@example.com
}

# One file per app. The glob has to match at least one file, so keep a site
# in sites/ before the first `up`.
import sites/*.caddy
```

Both paths are bind mounts, and Docker silently creates a *directory* for any
that doesn't exist — if `up` fails with "not a directory", that's why. Watch the
capitalisation too: `CaddyFile` won't match `./Caddyfile` on Linux.

If the server currently runs a per-app Caddy, that one holds ports 80/443. Stop
it, move its site block into `sites/`, and edit its stack to join `edge`: delete
the `caddy` service and its volumes, drop the `ports:` mapping, and give the
public service a prefixed alias. A frontend that proxies to a backend in its own
stack must list `default:` alongside `edge:` — naming any network replaces the
implicit default, and dropping it breaks that internal hop.

```bash
cd /opt/stacks/busulla
docker compose down --remove-orphans    # frees 80/443; --remove-orphans clears
                                        # the retired caddy container
nano docker-compose.yml
docker compose up -d
```

Certificates re-issue from scratch under the new proxy, because it has its own
`caddy-data` volume. That's a handful of Let's Encrypt requests — well inside the
rate limits — but don't repeat it needlessly.

### 4. Fetch this app

```bash
mkdir -p /opt/stacks/ipsetego && cd /opt/stacks/ipsetego
git clone https://github.com/guy1998/ipsetego.git .
```

(Only `docker-compose.prod.yml` and `.env` are actually needed — nothing is
built on the server.)

### 5. Configure `.env`

```bash
cp .env.example .env
nano .env
```

Set the production values:

```ini
NODE_ENV=production
ALLOWED_ORIGINS=https://ipsetego.com,https://www.ipsetego.com,https://app.ipsetego.com
FRONTEND_URL=https://ipsetego.com
BACKEND_URL=https://api.ipsetego.com

DATABASE_PASS=<a long random password>
JWT_KEY=<64 random hex chars>
ENCRYPTION_KEY=<exactly 64 hex chars>

GHCR_OWNER=guy1998
IMAGE_TAG=latest
```

The domains aren't in `.env` — they live in the proxy's `sites/ipsetego.caddy`
(step 6), because one shared Caddy can't take a single app's environment. Moving
the app to different hostnames means editing that file, the three URLs above,
and the `VITE_BACKEND_URL` build arg in the workflow.

Generate the secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# or, without node: openssl rand -hex 32
```

Then `chmod 600 .env`.

### 6. Start it

If the GHCR packages are private, log in first — otherwise skip this:

```bash
echo <github-PAT-with-read:packages> | docker login ghcr.io -u guy1998 --password-stdin
```

To avoid needing a token at all, make the three packages public once:
GitHub → your profile → Packages → each `ipsetego-*` package → Package settings →
Change visibility → Public.

```bash
cd /opt/stacks/ipsetego
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Migrations run automatically when the `backend` container starts. Now hand the
domains to the proxy — `/opt/stacks/sites/ipsetego.caddy`:

```
ipsetego.com, www.ipsetego.com {
	encode zstd gzip

	# Serve the apex domain, redirect www to it so there's one canonical origin.
	@www host www.ipsetego.com
	redir @www https://ipsetego.com{uri} permanent

	reverse_proxy ipsetego-client:80
}

app.ipsetego.com {
	encode zstd gzip
	reverse_proxy ipsetego-admin:80
}

api.ipsetego.com {
	encode zstd gzip

	# Keep the port in step with PORT in .env, and don't buffer — portfolio
	# media (CVs, project images) can be large.
	reverse_proxy ipsetego-backend:1989 {
		flush_interval -1
	}
}
```

Caddy resolves those upstreams per request, so the file is valid even while the
stack is down. Load it:

```bash
cd /opt/stacks
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
docker compose logs -f caddy    # watch certificates being issued
```

Verify:

```bash
curl -I https://ipsetego.com
curl -I https://app.ipsetego.com
curl -I https://api.ipsetego.com/auth/signup-status
```

### 7. Updating after a push to `main`

Wait for the workflow to finish, then on the server:

```bash
cd /opt/stacks/ipsetego
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker image prune -f
```

The proxy isn't involved — it resolves the upstream aliases per request, so
containers can be replaced underneath it without a reload. Only edits to
`sites/*.caddy` need one.

Pin a specific build instead of tracking `latest` by setting
`IMAGE_TAG=sha-abc1234` (or a release tag like `1.2.0`) in `.env`.

### Notes

- **Backups**: the database lives in the `ipsetego_db-data` volume. Dump it with
  `docker compose -f docker-compose.prod.yml exec db pg_dump -U postgres ipsetego > backup.sql`.
- **Certificates**: stored in the proxy's `edge_caddy-data` volume, shared by
  every app. Don't wipe it casually — Let's Encrypt rate-limits reissuance.
- **502s**: mean Caddy is up but the upstream isn't. Check the app's stack is
  running and actually on `edge`: `docker network inspect edge`.
- **Ollama**: if you run it on the Contabo host, keep `HOST=http://host.docker.internal:11434`.
  If you're on a small VPS, `LLM_PROVIDER=openai` is the cheaper option.

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

## Public signup

Self-signup (`/auth/register`, `/auth/confirm`) can be turned off for single-user deployments by setting `SIGNUPS_ENABLED=false` in `.env` — the backend then rejects both routes with a 403.

The `client` frontend checks this before rendering the sign-up form:

```
GET /auth/signup-status
→ { "enabled": true | false }
```

No auth required. When `enabled` is `false`, the `/sign-up` page skips the form entirely and shows a "star the repo" link instead of a dead-end signup UI.

### Creating the first (non-admin) user

There's no seed script or CLI for creating a regular user — the only path is the public signup form, which is why `SIGNUPS_ENABLED` starts out relevant even on single-user deployments. To create your first user:

1. Set `SIGNUPS_ENABLED=true` in `.env` (or leave it unset — it defaults to enabled).
2. Start the backend and sign up through the `client` frontend's `/sign-up` page.
3. Set `SIGNUPS_ENABLED=false` and restart the backend to close registration again.

Admin accounts don't go through this flow at all — they're granted purely by email via `ADMIN_WHITELIST` in `.env`, checked at login time in `adminLogin`.

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

## Free-tier database keep-alive

Free-tier Postgres providers (Supabase, Neon, Render, etc.) commonly pause or suspend the database after a period of inactivity. The backend runs a small cron job (`utils/db-keepalive.js`) that pings the DB with `SELECT 1` on a schedule to keep it awake — on by default. Configure it in `.env`:

- `DB_KEEPALIVE_ENABLED` — set to `false` to turn it off (e.g. on a paid/always-on database)
- `DB_KEEPALIVE_CRON` — standard cron syntax, default `*/5 * * * *` (every 5 minutes)

In Docker, migrations run automatically every time the `backend` container starts (`docker-entrypoint.sh`) — safe to re-run, already-applied migrations are skipped.

## License

See [LICENSE](LICENSE).
