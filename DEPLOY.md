# Deploying iGoTrend to a VPS

This guide covers deploying the full iGoTrend stack (API + web frontend + PostgreSQL) to any Linux VPS using Docker Compose, with automatic deploys triggered by pushing to `main` on GitHub.

---

## Architecture

```
Internet → nginx (port 80, inside the app container)
               ├── static files (React build)
               └── /api/* → Node.js API (port 8080, same container)
                                └── postgres (separate container, internal only)
```

A single Docker image (`vickypumpin/igotrend`) runs both nginx and the Node.js API server using **supervisord**. This means one container, one image to pull, and simpler VPS management.

---

## Required GitHub Secrets

Configure these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username (e.g. `vickypumpin`) |
| `DOCKER_TOKEN` | Docker Hub access token (not your password) |
| `VPS_HOST` | IP address or hostname of your VPS |
| `VPS_USER` | SSH username on the VPS (e.g. `ubuntu`, `root`) |
| `VPS_SSH_KEY` | Private SSH key for VPS access (paste the full `-----BEGIN...-----END` block) |

---

## First-Time VPS Setup

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in for the group change to take effect
```

### 2. Create the app directory and `.env`

```bash
mkdir -p ~/igotrend
cd ~/igotrend

# Download only the compose file from GitHub
curl -fsSL https://raw.githubusercontent.com/vickypumpin/igt/main/docker-compose.yml -o docker-compose.yml

# Create your environment file from the example
curl -fsSL https://raw.githubusercontent.com/vickypumpin/igt/main/.env.example -o .env
```

Open `.env` and fill in every required value — pay particular attention to:
- `POSTGRES_PASSWORD` — choose a strong, random password
- `DATABASE_URL` — must use the same password as `POSTGRES_PASSWORD`
- `JWT_SECRET` — at least 32 random characters
- `APP_URL` — the public URL where users access the app
- `DOCKER_USERNAME` — set to `vickypumpin` (used by docker-compose to resolve the image name)

### 3. Pull and start the stack for the first time

```bash
docker compose pull
docker compose up -d
```

The API server automatically applies database migrations on startup, so no manual schema setup is required.

### 4. Verify everything is running

```bash
docker compose ps
docker compose logs -f app
```

---

## How the Deploy Pipeline Works

1. You push a commit to the `main` branch of `github.com/vickypumpin/igt`.
2. GitHub Actions checks out the code and builds a single Docker image:
   - `vickypumpin/igotrend:latest` — nginx + Node.js API in one container
3. The image is also tagged with the short git SHA (e.g. `vickypumpin/igotrend:a1b2c3d4`) for traceability.
4. GitHub Actions SSHs into your VPS and runs:
   ```bash
   docker compose pull
   docker compose up -d --remove-orphans
   docker image prune -f
   ```
5. The new container starts. The API server runs database migrations automatically before accepting traffic.

---

## Useful Commands on the VPS

```bash
# View live logs from all services
docker compose logs -f

# View app logs only (nginx + API)
docker compose logs -f app

# Restart the app container
docker compose restart app

# Stop everything
docker compose down

# Stop and delete the database volume (DESTRUCTIVE — all data lost)
docker compose down -v
```

---

## Swapping to an External PostgreSQL

If you want to use a managed database (e.g. Supabase, RDS, Neon), edit `.env`:

```env
DATABASE_URL=postgresql://user:password@your-db-host:5432/igotrend
```

Then remove (or comment out) the `postgres` service from `docker-compose.yml` and remove the `depends_on: postgres` entry from the `app` service.

---

## SSL / TLS

SSL termination is **not** handled by the app container. The recommended approach is to run [Caddy](https://caddyserver.com/) or [Nginx Proxy Manager](https://nginxproxymanager.com/) on the host as a reverse proxy, pointing to port 80 of the `app` container and letting it handle HTTPS automatically.

Example Caddyfile for automatic HTTPS:

```
app.yourdomain.com {
    reverse_proxy localhost:80
}
```
