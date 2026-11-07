# GitHub Integration

AI PR Review accepts GitHub pull-request webhooks, processes supported events asynchronously, and posts review comments. The service validates webhook signatures before queueing work.

## GitHub App setup

Create a GitHub App in the account that owns the repositories. Configure:

- **Webhook URL:** `https://<your-host>/api/webhook/github`
- **Webhook secret:** a unique random value stored as `GITHUB_WEBHOOK_SECRET`
- **Repository permissions:** Pull requests (read and write), Contents (read), and Metadata (read)
- **Subscribed event:** Pull request

Install the app only on repositories that should be reviewed. Store the App ID, installation ID, and private key securely; do not commit private keys.

## Service configuration

Provide the applicable settings to the backend:

```text
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY_PATH=
GITHUB_INSTALLATION_ID=
GITHUB_WEBHOOK_SECRET=
GITHUB_WEBHOOK_SIGNATURE_REQUIRED=true
```

Set `OPENAI_API_KEY` or `CLAUDE_API_KEY` to enable a remote analysis provider. The deterministic provider is intended for demonstration and repeatable tests, not production review coverage.

The established `CODESAGE_*` environment variables and `codesage.*` Spring properties are retained for deployment compatibility. Refer to [.env.example](../.env.example) and `backend/src/main/resources/application.properties` for defaults and optional tuning.

## Validate delivery

1. Confirm the application health endpoint responds over HTTPS.
2. Open or synchronize a pull request in an installed repository.
3. Check GitHub App delivery logs for a successful response.
4. Confirm the review is recorded with `GET /api/reviews/recent` and that the comment appears on the pull request.

Supported webhook actions are `opened` and `synchronize`. Duplicate prevention currently uses repository identity and pull-request number; a later commit to a previously reviewed pull request is not versioned by head SHA.

## Troubleshooting

- **No delivery:** Verify the webhook URL, TLS route, firewall, and webhook event subscription.
- **Signature rejected:** Verify the configured secret and keep signature validation enabled outside local demos.
- **No review comment:** Check backend logs, provider availability, and the GitHub App's pull-request write permission.
- **Repeated event:** Review status and queue logs; duplicate deliveries are deliberately idempotent.

Never include private keys, webhook secrets, or customer payloads in issue reports or logs.
