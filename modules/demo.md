# Demo projects (practice targets)

Read when: `/deep-tester demo`, or the user explicitly asks for a demo or practice target, or wants to see what the skill does before pointing it at real code. Never create a demo because the real target is unclear, missing or down. The kit lives in `vendor/demo/`. Adapted from MIT-licensed material; see `THIRD-PARTY-NOTICES.md`. The script was not executed during the port.

## Fixtures

`python3 <skill dir>/vendor/demo/scripts/demo.py list` prints them. Bundled:

| Fixture | What it is | Start |
|---|---|---|
| `testbucks` (default) | Offline coffee-shop app: menu search, customization, cart, discounts, simulated payment outcomes, orders, persistence, practice exercises | `node server.mjs` (prints its URL; the OS picks a free loopback port) |
| `web-static` | Small multi-page static site: menu loading, search, form validation, local storage | `python3 -m http.server 8080` |
| `web-app` | Vanilla JS task board SPA: routing, create/edit/complete/delete, computed stats | see `manifest.json` |
| `api-server` | Small Node HTTP API with unit and integration tests | see `manifest.json` |
| `eval-runner` | Python evaluation-harness package with tests | see `manifest.json` |

Each fixture can be copied with or without its existing tests.

## Create

1. Ask where to put it. It must be a **new** child folder; the script refuses to overwrite an existing destination.
2. `python3 <skill dir>/vendor/demo/scripts/demo.py create --root <parent folder> --fixture testbucks --test-profile without-existing-tests` (default profile; use `with-existing-tests` if the user wants to see existing coverage inventoried). Check `--help` for the exact flags.
3. Show the destination and the start command. Start the server only with the user's yes, on its own port, and stop it at clean-up.
4. Run the requested mode (usually `/deep-tester quick`, then `/deep-tester assess`) with the copied folder as the target. The demo is local by definition, so the target question is already answered; every other hard rule applies.

The copy gets a `.deep-tester-demo.json` descriptor. The bundled fixtures are never written to. The two Playwright smoke tests in the fixtures read the app URL from `DEMO_URL`.
