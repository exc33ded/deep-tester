# Load module

Read when: the profile has any entry point (almost always).

## Tests

baseline; ramp load 1 -> N in steps; p50/p95/p99, error rate, server CPU/memory/DB connections per step, breaking point and what fails first. Brutal depth adds ramp-to-failure (within the cap) and a soak run.

## Tools

| Tool | Use it for | Add with (after a yes) |
|---|---|---|
| k6 / oha / wrk / autocannon / locust | HTTP load driver; k6 `constant-arrival-rate` for open-model load | use whichever is installed; else ask to install one into the scratch dir |

## Pick the driver by entry point and what is installed, never by the app's language

- HTTP: an installed load tool first (`k6`, `oha`, `wrk`, `autocannon`, `locust`); native ones also outrun fast servers (Rust, Go, Node). Else write a small driver in the project's own language or whatever is already on the machine (Node `fetch`, Python `httpx`, Go `net/http`), meeting the requirements below.
- CLI / batch: a launcher that spawns N processes in parallel and times spawn -> exit.
- RPC / stdio: a client that opens N sessions and sends concurrent messages.

Any driver, whatever the tool or language, must:
- count errors and timeouts per type instead of crashing (a crash loses the breaking point);
- allow USERS concurrent connections (client pools often cap lower and queue silently);
- check one real field in each response, not just the status code;
- run for a fixed duration, and divide by measured elapsed time (in-flight work runs past it);
- report users, req/s, p50/p95/p99 and the error breakdown per step.

## Rules

- **Load the real paths.** Every step replays a mix of the profile's Journeys at HTTP level (the same requests the browser makes, weighted by how often users do each) plus its Heavy paths, with paid and third-party calls stubbed. Correctness under simultaneous calls is `concurrency.md`; this module measures capacity. A no-op or `/health` run is the calibration baseline only; a report whose load table has only those is not a load test, and must say "real endpoints not loaded" in Not run.
- **Many users, for real.** Concurrency means N distinct identities where the app has per-user or per-tenant data, not N copies of one token. If extra accounts cannot be had, simulate with parallel in-process requests under N overridden identities and say that it is a simulation.

- **Calibrate first.** Run the driver against a no-op endpoint (or a no-op process spawn) on the same box. Its rate is the generator's ceiling; results near it measure the client, not the app. Measure it on this machine; never assume a number. Above it, switch to a native tool or several processes. Note in the report if driver and app share a machine.
- **Warm up, then hold each step ≥30s.** Short runs measure connection setup.
- **Watch the server.** Sample its CPU, memory and DB connections every few seconds during each step (`docker stats`; `ps -o pid,%cpu,rss -p <pid>` on macOS/Linux; `Get-Process -Id <pid>` on Windows). That is how you name what fails first.
- **429 is the rate limiter working, not the breaking point.** Report it as a pass; to go past it, use a bypass or test key the user approves, else "Not run".
- **Closed loop hides tail latency** under saturation (coordinated omission). Say so next to p99, or use k6 `constant-arrival-rate`.
- Start at 1, raise in steps until errors or p95 degrade, never past the approved max; record every step.

## Common mistakes

- Treating N subagents as N concurrent users.
- Load-testing a dev server (`--reload`, `next dev`) and reporting it as capacity.
- Reporting a breaking point that is really the load generator's ceiling or the rate limiter.
