# AI PR Review workspace

The React workspace displays aggregate review statistics, recent pull requests, findings grouped by severity, and details returned by the review API.

## Development

```powershell
npm ci
npm run dev
```

By default, the client uses the API URL configured in `src/services/api.js`. Set `VITE_API_URL` at build time to target another API origin.

## Checks

```powershell
npm run lint
npm test
npm run build
```
