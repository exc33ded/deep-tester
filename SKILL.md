---
name: deep-tester
description: Use when asked to deeply test, stress test, load test, QA, break, or audit an application end to end (web app, API, worker, CLI, installer, plugin, pipeline, LLM/RAG app), check how it behaves with many concurrent users or heavy input, or produce a test audit report. Also for lighter runs, such as a quick or bounded assessment of a change or app ("test this", "is it ready to ship"), testing one named feature, hunting bugs with stateful and persona journeys, an accessibility audit, a visual report or map of a run, background checks after code changes, or a practice demo app. Not for writing unit tests for one function.
---

# Deep Tester

Generic by design: it knows nothing about the app until recon. Recon builds an **app profile**; the profile decides which modules load, which tests exist, what the interview asks, and which report sections appear. Every claim in `TEST-AUDIT.md` needs evidence (a number, a log line, a screenshot path). Anything not run goes under "Not run / why". Never report a skipped test as a pass.

**Never changes the app.** The skill reads and exercises the target; it never changes the app's code, config, dependencies or existing tests. A bug is logged in `TEST-AUDIT.md`, never fixed. It does write, without asking: `TEST-AUDIT.md` at the repo root, and new regression tests in their own folder in the repo's test dir (e.g. `tests/deep-tester/`). Drivers, stubs and launchers live in the scratch dir.

**Flow:** read the code and write the profile with its Risks, Journeys and Lanes (1) -> ask only what recon could not answer (2) -> matrix and lane plan, user approves (3) -> one subagent per lane runs its rows in parallel, then the lead walks the user journeys in Chrome and verifies (4) -> regression tests for confirmed findings (5) -> report (6) -> clean up (7).

## Modes

Run a mode with `/deep-tester <mode> [target or scope]`, or just ask in plain words ("test my checkout", "is this ready to ship") and pick the mode from the request; when unclear, ask with the recommended mode first. Bare `/deep-tester` with a clear target is the full audit. Every mode keeps the hard rules below.

| Command | Mode | Use when | Flow | Read |
|---|---|---|---|---|
| `/deep-tester` or `/deep-tester full` | **full audit** | the whole app, under load, with lanes | steps 1-7 below | modules per profile |
| `/deep-tester assess [target]` | **assessment** | "test this", "is it ready", a change before shipping | bounded: ~20 checks, ~20 min, inline, no load | `modules/assessment.md`, `modules/evidence-report.md` |
| `/deep-tester quick [target]` | **quick** | first look at a clear target | ~2-3 min, up to 5 checks; never called full coverage | `modules/assessment.md`, `modules/evidence-report.md` |
| `/deep-tester focus <behaviour>` | **focused** | one named feature, flow, API or change | the named behaviour is the scope boundary | `modules/focused-test.md` + assessment |
| `/deep-tester hunt <area>` | **issue hunt** | "find bugs in X" | >=50% of the budget on executed stateful and persona journeys | `modules/issue-hunt.md`, `modules/personas.md` + assessment |
| `/deep-tester a11y [pages]` | **accessibility** | a11y audit of pages or flows | criterion-level WCAG 2.2 evidence | `modules/accessibility.md` + assessment |
| `/deep-tester report [run-id]` | report / map | show a run's evidence visually | render the evidence file | `modules/evidence-report.md` |
| `/deep-tester background` | background checks | automatic checks after code changes; pause, review | opt-in setup, never during a run | `modules/background-checks.md` |
| `/deep-tester demo` | demo | the user asks for a practice target | copy a bundled demo app, then run a mode | `modules/demo.md` |
| `/deep-tester help` | help | "what can you do?" | show this table, inspect only enough to suggest the smallest useful next run; no testing | none |

Lighter modes skip lanes and load, and ask only the round 1 safety questions they need; they still confirm the target, gate any write or paid step, write `TEST-AUDIT.md`, and add regression tests for confirmed findings. A request that grows beyond the mode (load, many users, several lanes) becomes a full audit, with the user's yes. Some modes adapt MIT-licensed material; see `THIRD-PARTY-NOTICES.md`.

**Dry run** (when asked): recon may run read-only commands (file reads, `--version` checks); produce profile with Risks and Lanes, the questions you would ask, the matrix and lane plan; stop after step 3. Nothing is spawned, started or written (no `TEST-AUDIT.md`, no tests).

## Hard rules (every module)

- **Load is a script, not subagents.** LLM subagents give 3-5 slow parallel actors at best. Load = a generated driver matching the entry point (see `modules/load.md`). Subagents run it, read results, or act as exploratory personas (confused user, hostile input).
- **Confirm the target.** First interview question. Beyond a read-only health check, the user must confirm local or staging; "production" -> refuse and re-ask. A local app wired to a shared database or service (check env/config for remote hosts) is not local: say so and ask.
- **Contain side effects.** Anything that writes to the machine (installers, hooks, CLIs touching HOME or config) runs against a scratch HOME/dir or a container, never the user's real one (see `modules/installer-hooks.md`).
- **Untrusted repos.** If the target is third-party code, do not run its scripts, installers or hooks without explicit approval. Run tool checks from outside the target dir (`npx --no-install`, global binaries) so a planted local binary cannot execute.
- **Paid and third-party calls.** Mock or stub by default. Real calls only under a cap the user approves (suggest 25). Never load-test someone else's service.
- **Mocks live outside the app.** Env vars or a launcher in a scratch dir outside the repo (system temp `deep-tester-run/`). Never edit app code. Reuse existing harnesses and mocks first.
- **Secrets.** Never print secret values, even during recon; name the variable only. Never `cat`, mask-with-sed or grep whole lines of `.env`/config files (masking misses `name = value` and lowercase keys). List names only, with a command that cannot emit values: `grep -oE '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=' .env`; for YAML/JSON/TOML keys `grep -oE '^[[:space:]]*"?[A-Za-z_][A-Za-z0-9_.-]*"?[[:space:]]*[:=]' <file>`. PowerShell: `Select-String -Path <file> -Pattern '^\s*(export\s+)?"?[A-Za-z_][A-Za-z0-9_.-]*"?\s*[:=]' | ForEach-Object { $_.Matches.Value }`. Every content search across the repo excludes secret files (`--glob '!.env*' --glob '!*.pem' --glob '!*secret*'`, or `grep --exclude`), since a broad search prints matching `.env` lines with values. If a value is ever printed, say so in the report and recommend rotation. Test accounts only, never real users' credentials; never create accounts in a shared DB unasked. Redact screenshots.
- **Kill-switches.** Any flag that skips the app's own logic (disables auth, validation, safety checks, rate limits, or a demo mode that fakes the app's responses) must be off on the target; if you cannot inspect a remote target, ask. If on, the affected tests go under "Not run". A flag that only stubs an external dependency (e.g. `MOCK_LLM`) is not a kill-switch: reuse it as the stub.
- **Any OS.** Works on macOS, Linux and Windows. Detect the host OS and shell in recon and write every command for that shell: POSIX `sh` on macOS/Linux (and Git Bash on Windows), PowerShell on Windows without one. Generated drivers use the project's language or a cross-platform runtime (Node, Python), never a shell-only script; paths come from the runtime (`os.tmpdir()`, `tempfile`, `path.join`), never hard-coded `/tmp` or `C:\`. If the app targets several OSes and only one is available, the others go under "Not run".
- **Tools: ask before adding any.** Never install a tool, package or MCP server, or change the user's config, without asking first. Ask with the exact command and what it writes; on "no", the tests that need it go under "Not run". Prefer what is already installed. Each module lists its tools.

## 1. Recon -> app profile

Read code, config, docs, existing tests and prior test/audit reports. Check driver tools with `--version` (global binaries only, run from outside the target dir). Monorepo: one profile per component, then one matrix covering the in-scope ones. Write the profile in this shape, `none` where absent, `file:line` for each claim:

```
Component: <name>  Kind: <every type that applies, joined with +, e.g. http-api + web-ui; from: http-api, web-ui, cli, worker, rpc/stdio server, llm-app, hooks/plugin, installer, gui/tui, library>
Host: <OS + shell this run uses>   Target OSes: <which OSes the app supports (CI matrix, docs, platform checks in code)>
Entry points: <start cmd, ports, health check>
Run mode: <dev (--reload, next dev, debug) | prod build>; workers/processes; load numbers from dev mode say nothing about prod
Identity: <none | sessions | tokens | keys>; tenants/roles; kill-switches
Inputs: <uploads, request bodies, CLI args, stdin, RPC payloads>
Heavy paths: <subprocesses, model load/cold start, file generation, long loops>
External deps: <each SDK/HTTP client: paid? rate-limited? third-party?>
State: <DBs, storage, caches, files written, where (local vs shared)>
Shared-state ops: <each read-modify-write on shared state (counter, balance, stock, booking, unique-name check, file append, in-memory dict/cache), file:line, and the invariant to check after N simultaneous calls>
Journeys: <user flows from routes, nav and forms (sign up, create, edit, delete, checkout), file:line, and the expected end state of each; feeds the Chrome walkthrough and the load mix>
Surface: <public routes, CORS, API docs, rate limits, URL-fetching features, locales>
Tools: <present / missing>   Prior findings: <from earlier reports>
Risks: <hypotheses from reading the code, highest first, each with file:line and what would prove it>
Lanes: <which of backend/inputs, tenancy/state (incl. concurrency), load, cli/installer apply, and the module rows each owns; plus whether the lead's Chrome walkthrough applies>
Modules: <which files below apply>
```

**Kind comes from evidence, not the README.** Check the manifests (package.json, pyproject, go.mod, Cargo.toml, composer.json, Gemfile) and entry files, and cite the `file:line` for each kind. List every kind that applies, never just one: an app with a server and pages is `http-api + web-ui` and gets both sets of tests.

| Signal | Kind |
|---|---|
| Server framework (`express`, `fastify`, `nest`, `fastapi`, `django`, `flask`, `rails`, `gin`, `spring`, `laravel`), `.listen(`, `app.run`, `http.createServer` | http-api |
| `react`/`vue`/`svelte`/`angular`/`next`/`nuxt`/`vite`, served `index.html`, `pages/` or `app/` dir, templates | web-ui |
| Frontend only, calling someone else's API | web-ui; the external API is an External dep, never load-tested |
| `bin` in package.json, `[project.scripts]`, `argparse`/`click`/`typer`/`cobra`/`clap`, `main` reading argv | cli |
| Queue consumers (`celery`, `bullmq`, `sidekiq`, `rq`), cron or scheduler entries | worker |
| stdio JSON-RPC / LSP / MCP server, gRPC service | rpc/stdio server |
| Model SDK calls (`openai`, `anthropic`, `langchain`, `llama_index`, `litellm`), prompt templates, a retriever or vector store, tool/function calling | llm-app (chat, RAG or agent feature; combine with the kind that serves it) |
| `install.sh`, `.msi`/`.pkg`/`.deb`, `postinstall`, hook or plugin manifests | installer / hooks/plugin |
| Electron, Tauri, Qt, curses/`ink`/`bubbletea` | gui/tui |
| Only exports, no entry point | library |
| Several of the above in `apps/`, `packages/`, `services/` or `docker-compose.yml` | monorepo: one profile per component |

**Risks is required output, not luck.** Read the handlers, not just the route list. Look for: server-side fetches of caller-supplied URLs; rendering of caller-supplied HTML or templates; file paths built from input; queries or writes missing a tenant filter; check-then-insert races with no DB constraint; unvalidated free text sent to paid APIs; permissive CORS or readable session cookies; secrets or internals in error bodies; endpoints that ignore the flag that is supposed to gate them; model output or retrieved text that reaches a tool call, a shell, a query or an HTML renderer. A profile with an empty Risks line means recon was not done.

## Modules (read only the ones the profile needs)

| Profile has | Read |
|---|---|
| Any entry point | `modules/load.md` |
| http-api, worker, rpc server; or Identity, Inputs, Heavy paths, External deps, URL-fetching, HTTP surface, State | `modules/backend.md` |
| llm-app (any model call, prompt, retriever or model tool) | `modules/llm-app.md` |
| Shared-state ops not `none` | `modules/concurrency.md` |
| web-ui, or UI in scope | `modules/web-ui.md` |
| web-ui with accessibility in scope beyond the automated pass | `modules/accessibility.md` and `knowledge/wcag22.md` |
| Journeys not `none` (persona walks) | `modules/personas.md` and `knowledge/specialists.md` |
| Building the matrix for any quality area the profile touches | `knowledge/domains.md` (only the domains the profile has) |
| cli, worker, batch/pipeline, rpc/stdio server | `modules/cli-rpc.md` |
| installer, hooks/plugin, or writes to HOME / shell rc / user config | `modules/installer-hooks.md` |
| library | no module: API misuse, boundary inputs, large inputs |
| gui/tui | no module: manual check or "Not run" |
| any confirmed finding | `modules/regression-tests.md` (read at step 5, after findings exist) |

Read the matching modules before step 2: their tools feed the interview and their test tables feed the matrix. Do not open modules the profile does not need.

## 2. Interview

Use `AskUserQuestion` (max 4 questions per round, 2-4 options each, max 3 rounds). Without it (e.g. running as a subagent): return the questions to the caller and stop. Ask only what recon could not answer from the code, config and docs; never ask for something the profile already states. Put a recommended default first in every question. Whatever does not fit in 3 rounds goes into the step 3 matrix as a stated default the user can change at the gate.
- Round 1 (safety), 4 questions: target; who starts/stops processes and the wait budget; paid-call cap; destructive/write tests allowed.
- Round 2 (scope), confirming the Lanes line, up to 3 questions:
  1. Lanes (multiSelect; every lane and the Chrome walkthrough the profile implies is on by default; the user turns them off, you do not).
  2. Depth and load in one question, e.g. "smoke / standard to 50 users for 5 min / brutal". **smoke** = baseline + each matching row once at 1 user, no ramp; **standard** = all matching rows, ramp to the approved max on the profile's Heavy paths and Journeys (not `/health`); **brutal** = standard + ramp until failure (still within the cap), a soak run, hostile inputs, optional ZAP.
  3. Test accounts, only if Identity is not `none`. If the profile has tenants, roles or per-user data, ask for at least two accounts in different tenants plus one with no membership, and state the fallback: in-process test with overridden identities and the project's fake DB, never silently skipped.
- Round 3 (risks): the top 4 Risks items, one question each (test against a local canary? allow writes? known and accepted?). Further risks and missing tools (exact install command, or "Not run") go into the matrix as defaults.

## 3. Test matrix, approval gate

Include only module rows matching the profile, plus one row per Risks item; mark each prior finding row "re-verify". Columns: lane, test, driver (script / persona / Chrome / manual), cost (`none` or estimated paid calls/$), risk (`low` read-only, `med` writes test data, `high` touches external systems or could leak data).

Under the matrix put a **lane plan**: for each lane its rows, port, scratch dir, slice of the paid-call cap (split, not shared), test-row prefix if it writes to a shared DB, and what it must not do (no lane uses Claude in Chrome; a load lane runs a script and does not act as the users). List the web-UI rows and Journeys the lead will run in Chrome after the lanes return. Say plainly which approved rows no lane covers. State the subagent count and rough token cost (see Agent budget, step 4). Wait for a clear yes; that yes authorizes spawning the lanes. Record the approved scope and caps, and create `TEST-AUDIT.md` now with the profile, scope and matrix, so the report exists before any lane runs.

## 4. Run

**Agent budget.** Each subagent starts cold, re-reads code and costs tokens, so spawn as few as the work needs:
- **Inline, no subagents:** smoke depth, a single-lane matrix, or a lane with only a few rows.
- **At most 3 subagents** otherwise. Merge small lanes into one (e.g. backend/inputs + tenancy/state) rather than spawning one each; going above 3 needs the user's yes at the gate.
- Never spawn a subagent to read, summarize or verify; the lead does that. No subagent spawns another.
- Brief with the profile excerpt and `file:line` pointers (`lane-brief.md`), not "read the repo", so lanes do not redo recon.
- Scripts do the heavy work: a lane writes and runs a driver and reads its summary output, never raw per-request logs.
- The gate states the plan's cost: number of subagents and a rough token estimate (e.g. "2 subagents, ~150k tokens").

Spawn the approved subagents in a single message so they run in parallel, each briefed from `lane-brief.md` with its approved rows, the profile excerpt, its caps, port, scratch dir and a lane report path in the scratch dir. A single-lane matrix, or a subagent that cannot spawn others, runs inline. Lanes: backend/inputs; tenancy/state (incl. concurrency); load; cli/installer. Lanes never share a port, scratch dir or paid-call slice, never use the user's running servers, and never use Claude in Chrome.

While lanes run, the lead does no lane work. When they return, the lead:
1. Runs the approved `modules/web-ui.md` rows, Journeys first: walks each one in Claude in Chrome as a real user would (Chrome is one shared profile, so this is the lead's job, done once lanes are finished).
2. Spot-checks at least one piece of evidence per lane by re-running it a second way (a single crude check can be wrong: a raw byte search of a PDF falsely said an edit was missing). Lanes stop their processes before returning, so the lead starts the target itself for this, on its own port.
3. Reconciles every approved row as passed, failed or Not run, and every lane's list of created files, processes and test rows against clean-up.
4. Updates `TEST-AUDIT.md`, which already exists from step 3.

Stay inside the approved caps and time budget; rows that do not run go under "Not run / why". If the budget forces a choice, every approved lane gets at least its smoke-level rows before any lane goes deep. When you finish with any approved row or lane not run, say so in the chat reply, naming it ("I did not get to X"), in the same message you call the pass done. A footnote in the report is not enough.

## 5. Regression tests (every confirmed finding)

Follow `modules/regression-tests.md`: one expected-to-fail test per confirmed finding (races included), in the project's framework, in a new folder in the repo's test dir. The lead writes them; lanes do not.

## 6. Report

Update `TEST-AUDIT.md` (created at step 3, from `report-template.md`) as each lane returns: profile, severity counts, then one section per capability tested, findings rated CRITICAL / HIGH / MEDIUM / LOW by the template's definitions, regression tests (if any), "Not run / why", reproduction. The verdict follows the template's rules, not judgement. Save it at `<repo root>/TEST-AUDIT.md`. State the full path in the final reply. Optionally (always in the lighter modes) record the run in the evidence file and render the HTML report and map from it (`modules/evidence-report.md`); they live in the scratch dir unless the user asks to copy them.

## 7. Clean up

Stop every process you started, free the ports (check with `lsof -i :<port>` on macOS/Linux, `ss -ltnp` if `lsof` is missing, `Get-NetTCPConnection -LocalPort <port>` on Windows), remove test data you created (or list what remains in the report), and leave the scratch dir path in "Reproduction".

## Common mistakes

- Load against a paid or third-party service without a cap.
- Adding tests for capabilities the profile does not contain, or loading modules it does not need.
- Omitting what was skipped, or hiding an approved lane that got no coverage in the report footer instead of saying it in the chat reply.
- Running everything as one agent in sequence on a big matrix, so the first lane eats the budget; or the opposite, one subagent per small lane, paying cold-start tokens for a few rows.
- Counting a check that does not exercise the thing as coverage: `/health` as load, 401-on-bad-token as tenant isolation, "N calls did not crash" as no race.
- Fixing a bug instead of logging it, or editing app code, config or existing tests to add a mock. New test files in their own folder are the only repo writes besides `TEST-AUDIT.md`.
- Briefing a subagent to extract credentials or tokens from the user's browser or config. Lanes use in-process identity overrides or a test token the user put in an env file.
- (Module-specific mistakes live in each module.)
