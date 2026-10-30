# Concurrency module (many users on one function at once)

Read when: the profile's Shared-state ops line is not `none`.

Answers "is it still correct when N users do this at the same instant?", not "how much can it take?" (that is `load.md`). Small N, many repeats, an invariant checked every time.

## Tests

| If profile has | Tests |
|---|---|
| Shared-state op (counter, balance, stock, booking, unique name/email, file append, in-memory dict or cache) | N callers released at once on the same record; check the op's invariant after each iteration; crashes, 500s, deadlocks, timeouts by type |
| Check-then-insert with no DB constraint | N identical creates at once: exactly one wins, the rest get a clean error, no duplicate rows |
| Per-user or per-tenant data | N distinct identities writing and reading at once: no row, cache entry or response crossed users |

Run each op at two levels (both by default when the code runs locally):
- **Function level:** import the function and call it N times at once (threads, `asyncio.gather`, `Promise.all`, goroutines), with the project's fake DB or a scratch DB. Pinpoints the line.
- **HTTP level:** N requests to the running app, released together. Catches what only shows across server workers. It writes and resets rows every iteration, so it needs round 1's "writes allowed" and a test-row prefix; if writes were declined it goes under "Not run" and function level still runs against the fake DB.

## Driver requirements

Any driver, whatever the language, must:
- hold all N callers at a barrier and release them together (a loop that starts them one by one is not concurrent);
- use small N (2-20) and many iterations (default 200): races are probabilistic, one clean run proves nothing;
- reset the record to a known state before each iteration and check the invariant after it (final count == N, no duplicates, balance >= 0, every record parses);
- at HTTP level, allow N sockets (client pools often cap lower and serialize silently);
- report "k/200 iterations violated", plus the error breakdown; never just "passed".

## Rules

- **Calibrate the harness first.** Point it at a deliberately unprotected counter in the scratch dir (read, sleep 1 ms, write). If it does not catch that race, it cannot catch a real one; fix the driver before testing the app.
- **Prod process model.** Run with the prod worker/process count (gunicorn workers, cluster mode, replicas). An in-memory lock protects nothing across processes, and a single-process dev run hides that.
- **Name the invariant before running.** It comes from the profile's Shared-state ops line. No invariant, no test: a run without one only checks that nothing crashed.
- Every confirmed race becomes a regression test (`regression-tests.md`). The race is logged, never fixed.

## Common mistakes

- Checking only that concurrent calls did not crash, not that the result is right.
- One run at N=50 reported as "no race". Use small N, many iterations.
- Testing with one worker when prod runs several.
- Treating this as load: it measures correctness, not req/s.
