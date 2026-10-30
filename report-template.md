# TEST-AUDIT — <app> — <date>

**Target:** <url, environment>  **Host OS:** <OS the run used; untested target OSes go under Not run>  **Depth:** <smoke|standard|brutal>  **Approved scope and caps:** <users, duration, paid-call cap, destructive yes/no>
**Verdict:** SHIP / SHIP WITH FIXES / DO NOT SHIP / INCONCLUSIVE

Verdict rules, first match wins: any CRITICAL -> DO NOT SHIP; an approved lane or Journey walk not run -> INCONCLUSIVE; any HIGH or MEDIUM -> SHIP WITH FIXES; else SHIP.

| CRITICAL | HIGH | MEDIUM | LOW |
|---|---|---|---|
| <n> | <n> | <n> | <n> |

Severity (rate at the highest level any bullet matches):
- **CRITICAL:** loss or corruption of persisted user data (incl. a lost-update or duplicate-write race), cross-user/tenant leak, auth bypass, secret exposed, crash that breaks a core Journey, test touched the real HOME/DB.
- **HIGH:** a core Journey fails or gives a wrong result, server 500s or falls over below the approved load, race that corrupts derived or non-persisted state (cache, counter shown, session), SSRF, unbounded upload.
- **MEDIUM:** degraded but recoverable: p95 over target at approved load, errors swallowed, missing rate limit or security header, confusing failure on bad input.
- **LOW:** cosmetic, minor a11y or layout, noisy console, hardening suggestion.

## Confidence in the tested scope
- **Scope:** <what was actually exercised>
- **Rationale:** <why the evidence supports this level of confidence>
- **Limitations:** <what was not covered, stubbed or blocked>
- **Score:** <0-100 only when the evidence supports one; otherwise "not assessed" and what evidence is needed>

An evidence-qualified judgement beside the verdict, not instead of it, and not a probability of correctness.

## App profile
<kind, identity model, heavy paths, shared-state ops, journeys, external deps, state: from recon, with file:line>

## Summary
<3-5 lines: what was tested, what broke first, biggest risk>

## Findings (most severe first, numbered #1, #2...)
### [CRITICAL|HIGH|MEDIUM|LOW] <title>
- **Strength:** <demonstrated (reproduced) | source-proven (code path plainly wrong, not executed) | suspected>
- **Where:** <route / page / file:line>
- **Observed:** <what happened>
- **Evidence:** <number, log line, or screenshot path>
- **Repro:** <command or steps>
- **Suggested fix:** <one line>
- **Verify the fix:** <the check or test that proves it is fixed>

## Results by capability
One section per capability that was actually tested (delete the rest). Use a table that fits it, for example:

### Load and thresholds
| Users | Req/s | p50 | p95 | p99 | Error % | Notes |
|---|---|---|---|---|---|---|
Breaking point: <load / what failed first>

### Concurrency (same function, same moment)
| Op | Level (function / HTTP) | N | Iterations | Invariant | Violated | Errors | Evidence |
|---|---|---|---|---|---|---|---|

### User journeys (Chrome)
| Journey | Expected end state | Actual | Evidence (screenshot / GIF) |
|---|---|---|---|

### <Identity | Tenancy | Inputs | Heavy paths | External deps | URL-fetching | HTTP surface | State | Web UI | CLI/worker | RPC/stdio | Hooks/plugin | Installer | Library>
| Case | Expected | Actual | Evidence |
|---|---|---|---|

## Regression tests (one per confirmed finding, expected-to-fail until fixed)
| File | Test | Finding | Fails today on | Run with |
|---|---|---|---|---|

## Passed
<short list with evidence pointers>

## Not run / why
<every skipped test and the reason: cap, no staging, tool missing, auth bypass on, user declined; in lighter modes, every check left deferred or blocked>

## Reproduction
<scripts and commands used, test accounts by role (no secrets)>
