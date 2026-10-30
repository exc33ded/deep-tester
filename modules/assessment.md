# Assessment and quick first pass

Read when: `/deep-tester assess` or `/deep-tester quick`, or a plain "test this" / "is it ready" request (see `SKILL.md`, Modes). Adapted from MIT-licensed material; see `THIRD-PARTY-NOTICES.md`.

An assessment is a bounded, complete investigation: the most consequential checks the budget allows, run for real, with every finding kept and an honest statement of what was not covered. It is not a full audit (no lanes, no load) and not a plan.

## 1. Resolve the target first

- Use what the request names: a URL, folder, repo, API, app, feature, document or requirements. Else a clearly selected project or an unambiguous target in this conversation. A read-only listing of the current folder may show whether it holds a project.
- An empty folder, the skill or plugin folder, the home folder, an unrelated browser tab or an old report is not a target. If the folder is empty, several targets are equally likely, or intent is unclear, ask: **What should I test? A website URL, a local folder or repo, an API endpoint, an app or feature, or requirements to review.** Offer the obvious candidates, then wait. Do not invent an app, create a demo, scan parent folders or report a confidence score while waiting.
- A URL is a valid target with no source code. Evidence goes to the scratch dir.
- A clear target: say it in one line and proceed. A bare request to test authorizes the normal assessment within the budget, not a plan or a help page. Do not make the user repeat the target or pick a focus; use all relevant areas. An explicit narrow scope, review-only request, time limit or safety boundary still wins.
- Missing access or a stopped app blocks that target. It is never permission to test a demo instead. Continue other safe work and state the blocker.

The hard rules still apply in full: the target-confirmation rule (local or staging; production refused), side-effect containment, secrets, paid-call stubs, and asking before adding tools.

## 2. Budget

| Mode | Time (guidance, not enforced) | Checks |
|---|---|---|
| quick (first pass on a clear target) | about 2-3 minutes | up to 5: the changed behaviour plus one consequential failure case |
| assessment | about 20 minutes | up to 20, selected by consequence |

Explicit user limits win. If the repo has a `deep-tester.settings.json` the user created (`minutes`, `maxChecks`, `focus`), apply it; write or change it only when asked, and never put credentials in `focus`. Setup can use up the budget: disclose incomplete execution instead of silently extending it. A quick pass never presents itself as full coverage; offer the full assessment after it.

## 3. Light recon and gate

- Profile lines needed: Kind, Entry points, Run mode, Identity, External deps, State, Journeys, Risks (same format as `SKILL.md` step 1). Inventory existing tests and requirements.
- Interview: round 1 (safety) only, and only questions recon could not answer. Business-context questions that would change the result are collected and asked at the end, not up front.
- Gate: state the scope, the selected checks and the safe approach in one message. Read-only checks (risk `low`) may start after that message. Any check that writes test data, costs money or touches an external system (risk `med`/`high`) waits for a clear yes, as in step 3 of the full audit.
- Run inline. No lanes, no subagents, no load.

## 4. Select checks by consequence, not file count

A good slice includes:
- at least one consequential business outcome (the order exists, the total is right, the email was queued, the score is what the contract says);
- stateful journeys from the profile's Journeys;
- input boundaries and permissions;
- recovery (bad input, dependency failure, interrupted work);
- relevant security and privacy risks (never skipped because a dedicated module exists);
- one goal-driven persona journey (`modules/personas.md`) in an assessment.

Vary initial data, timing, permissions, multi-tab state, logout/login, reload, export/reimport and interrupted work where relevant. Pull check families from `knowledge/domains.md` and perspectives from `knowledge/specialists.md` for the areas the profile touches. Fewer well-executed checks beat a list of imaginary passes.

## 5. Oracles and finding strength

- Ground expected outcomes in contracts and observable customer outcomes. Label assumptions.
- Every finding has a **strength**: `demonstrated` (reproduced failure), `source-proven` (the code path is plainly wrong, not executed), or `suspected`. Never present suspected as demonstrated.
- Simulated persona reactions are not user research. A score is not a probability of correctness.

## 6. Record and finish

Record checks, findings, pages, journeys, personas and blockers in the evidence file (`modules/evidence-report.md`) as you go. Check statuses: `planned`, `running`, `passed`, `failed`, `blocked`, `deferred`. `passed` and `failed` need `actual` and `evidence`; a generated or unexecuted test is never `passed`. Before finishing, every `planned`/`running` check becomes `deferred` or `blocked`.

Finish with:
- every finding, none hidden, no quota: severity, strength, consequence, reproduction, evidence, suggested fix, and the check that verifies the fix;
- executed versus deferred/blocked coverage;
- **confidence in the tested scope**: scope and rationale required, limitations encouraged, a 0-100 score only when the evidence supports one. Otherwise write **not assessed** and what evidence would be needed. Never a token count, cost placeholder or unmeasured metric;
- prioritized next tests or fixes;
- the optional business-context questions collected along the way.

Write `TEST-AUDIT.md` from `report-template.md` as usual (the verdict rules still apply; confidence sits beside the verdict, not instead of it). Confirmed findings get regression tests as in step 5 of the full audit.

## Talking about results

A question about status or a past run ("what did you find?", "explain the last report") is answered from the recorded evidence and `TEST-AUDIT.md`, saying when it is stale or missing. It does not start a new run. Use precise words: planned, observed, suspected, reproduced, blocked, changed, verified-fixed. Fixes still need the user's authorization; never claim a fix is verified without re-running its check.

## Common mistakes

- Testing a demo or a guessed app because the real target was unclear or down.
- Reporting a confidence percentage the evidence cannot support.
- A quick pass described as coverage of the whole app.
- Blocking the whole run on optional business questions instead of asking them at the end.
