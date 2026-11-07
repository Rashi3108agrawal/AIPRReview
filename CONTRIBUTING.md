# Contributing

Thank you for helping improve AI PR Review. Changes should be focused, tested, and consistent with the existing engineering workflow.

## Before you start

- Use Java 17, Node.js 22, and Docker Compose for local development.
- Review [the architecture guide](docs/architecture.md) and [security policy](SECURITY.md) before changing service boundaries or webhook handling.
- Open an issue or discussion in the hosting project's contribution system before proposing a large behavior change.

## Development

Run PostgreSQL and RabbitMQ locally, then start the backend and frontend in separate terminals:

```powershell
cd backend
..\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

```powershell
cd frontend
npm ci
npm run dev
```

The frontend is served by Vite at `http://localhost:5173`; the API listens on port `8080`.

## Validation

```powershell
cd backend
..\mvnw.cmd --batch-mode clean verify

cd ..\frontend
npm run lint
npm test
npm run build
```

Add or update tests when behavior changes. For changes to webhook intake, queue processing, persistence, or provider selection, include backend tests that cover the affected path.

## Pull requests

- Keep changes narrowly scoped and explain user-visible effects.
- Preserve API, database, queue, and configuration compatibility unless a migration is part of the proposal.
- Include validation commands and their results in the pull request description.
- Update operator or contributor documentation when setup or operations change.
- Use a clear commit subject; [Conventional Commits](https://www.conventionalcommits.org/) is encouraged.

## Code style

- Follow the surrounding Java and React conventions.
- Prefer small, explicit changes over new abstractions.
- Document non-obvious decisions; avoid comments that restate the code.
