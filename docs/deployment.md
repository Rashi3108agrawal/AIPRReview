# Deployment

The repository includes Docker Compose definitions for a production-oriented stack and an isolated local demonstration. The production stack contains the API, frontend, PostgreSQL, and RabbitMQ; the demo stack enables deterministic review requests without GitHub or AI-provider credentials.

## Production Compose

Provide `POSTGRES_PASSWORD`, `RABBITMQ_USERNAME`, and `RABBITMQ_PASSWORD` through a secret manager or an untracked local `.env` file. Configure at least one remote provider and the GitHub App credentials required by your integration.

```powershell
docker compose up -d --build
docker compose ps
curl.exe --fail http://localhost:8080/actuator/health
curl.exe --fail http://localhost/api/reviews/health
```

The frontend is published on port `80` and the API on port `8080`. Restrict access to infrastructure ports and management endpoints at the network boundary.

## Local demonstration

Generate unique demo credentials, then start the isolated demonstration stack:

```powershell
$env:CODESAGE_DEMO_POSTGRES_USER = "reviewdemo"
$env:CODESAGE_DEMO_POSTGRES_PASSWORD = (New-Guid).Guid
$env:CODESAGE_DEMO_RABBITMQ_USERNAME = "reviewdemo"
$env:CODESAGE_DEMO_RABBITMQ_PASSWORD = (New-Guid).Guid
docker compose -f docker-compose.demo.yml up -d --build --wait
curl.exe --fail -X POST http://localhost:8080/api/demo/reviews
```

Open the dashboard at `http://localhost:8088`. Remove the demo containers and their database volume when finished:

```powershell
docker compose -f docker-compose.demo.yml down -v
```

## Runtime configuration

See [.env.example](../.env.example) for supported settings. Existing `CODESAGE_*` variables and `codesage.*` properties remain in use to preserve compatibility with deployed environments. Set `GITHUB_WEBHOOK_SIGNATURE_REQUIRED=true` and `CODESAGE_DEMO_ENABLED=false` in production.

## Operations

- Terminate TLS at a trusted reverse proxy or managed ingress.
- Restrict `/actuator` access to monitoring infrastructure.
- Use strong, rotated database, queue, GitHub App, and provider credentials.
- Back up PostgreSQL and test restoration before relying on backups.
- Monitor `/actuator/health` and the Prometheus endpoint exposed by the service.
- Review [the security policy](../SECURITY.md) before making a deployment internet-accessible.
