# Backend module

Read when: the profile is an http-api, worker or rpc server, or has Identity, Tenants, Inputs, Heavy paths, External deps, a URL-fetching feature, an HTTP surface or State.

## Tests (include only rows the profile has)

| If profile has | Tests |
|---|---|
| Identity | no / expired / malformed / wrong-signature credential per route group; privilege escalation; auth rate limit |
| Tenants or roles | cross-tenant read/write; no-membership user; multi-membership; revoked access lag. Needs two real accounts in different tenants; else run the same cases in-process with two overridden identities and the project's fake DB. Never mark "401 for bad tokens" as covering this row. Concurrent: both tenants writing and reading at once, then check no row crossed. |
| Inputs | oversized, wrong type, corrupt, empty, malformed, unicode, injection strings; uploads without size caps |
| Heavy paths | largest realistic input, repeated runs, memory growth, timeouts, cold vs warm, concurrent first requests |
| External deps | stub slow, 500, 429, down: retries, timeouts, errors surfaced or swallowed |
| URL-fetching feature | SSRF to localhost, link-local, LAN; size and time caps |
| HTTP surface | CORS, exposed docs, security headers, Host/Origin checks, missing rate limits |
| State | data left behind, cleanup; simultaneous writes on shared state go through `concurrency.md` |

Mark security rows "automated only".

## Tools

| Tool | Use it for | Add with (after a yes) |
|---|---|---|
| ZAP (optional, brutal depth) | baseline passive security scan of local/staging | Docker `zaproxy/zap-stable zap-baseline.py -t <url>` (local target: use `host.docker.internal`, not `localhost`; on Linux add `--add-host=host.docker.internal:host-gateway`) |

## Rules

- Stub external deps through env vars or base-URL overrides in a scratch launcher; check the stub's hit count matches requests sent, so you can prove no real call went out.
- Test tokens: prefer real test accounts; minting tokens with the app's signing secret needs the user's approval, and the secret is used, never shown.

## Common mistakes

- Testing a "local" app that writes to a shared database.
- Calling the app "secure" from an automated pass alone.
