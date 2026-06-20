# Deploying iGoTrend to a VPS

This guide covers deploying the full iGoTrend stack (API + web frontend + PostgreSQL) to any Linux VPS using Docker Compose, with automatic deploys triggered by pushing to `main` on GitHub.

---

## Architecture

```
Internet → nginx (web container, port 80)
               ├── static files (React build)
               └── /api/* → api container (port 8080)
                                └── postgres container (port 5432, internal only)
```

---

## Required GitHub Secrets

Configure these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username |
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
curl -fsSL https://raw.githubusercontent.com/<your-org>/<your-repo>/main/docker-compose.yml -o docker-compose.yml

# Create your environment file from the example
curl -fsSL https://raw.githubusercontent.com/<your-org>/<your-repo>/main/.env.example -o .env
```

Open `.env` and fill in every required value — pay particular attention to:
- `POSTGRES_PASSWORD` — choose a strong, random password
- `DATABASE_URL` — must use the same password as `POSTGRES_PASSWORD`
- `JWT_SECRET` — at least 32 random characters
- `APP_URL` — the public URL where users access the app

### 3. Pull and start the stack for the first time

```bash
docker compose pull
docker compose up -d
```

The API container automatically applies database migrations on startup, so no manual schema setup is required.

### 4. Verify everything is running

```bash
docker compose ps
docker compose logs -f api
```

---

## How the Deploy Pipeline Works

1. You push a commit to the `main` branch.
2. GitHub Actions checks out the code and builds two Docker images:
   - `<your-dockerhub>/igotrend-api` — the Express API server
   - `<your-dockerhub>/igotrend-web` — nginx serving the React static build
3. Both images are pushed to Docker Hub tagged `latest` and with the short git SHA (for traceability).
4. GitHub Actions SSHs into your VPS and runs:
   ```bash
   docker compose pull
   docker compose up -d --remove-orphans
   docker image prune -f
   ```
5. The new containers start. The API container runs database migrations automatically before accepting traffic.

---

## Useful Commands on the VPS

```bash
# View live logs from all services
docker compose logs -f

# View API logs only
docker compose logs -f api

# Restart a specific service
docker compose restart api

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

Then remove (or comment out) the `postgres` service from `docker-compose.yml` and update the `api` service to remove its `depends_on: postgres` entry.

---

## SSL / TLS

SSL termination is **not** handled by the web container. The recommended approach is to run [Caddy](https://caddyserver.com/) or [Nginx Proxy Manager](https://nginxproxymanager.com/) on the host as a reverse proxy, pointing to port 80 of the `web` container and letting it handle HTTPS automatically.

Example Caddyfile for automatic HTTPS:

```
app.yourdomain.com {
    reverse_proxy localhost:80
}
```
