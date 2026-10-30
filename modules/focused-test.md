# Focused test (one named behaviour)

Read when: `/deep-tester focus <behaviour>`, or the user names one feature, flow, API, page, component, behaviour or change ("test password reset", "check the cart totals"). Adapted from MIT-licensed material; see `THIRD-PARTY-NOTICES.md`.

- **The named behaviour is the scope boundary.** Do not turn a focused question into a full-site audit. Unrelated problems noticed on the way are recorded as findings with strength `suspected` or `demonstrated`, not chased.
- Follow `modules/assessment.md` for target resolution, gate, budget (assessment default), evidence and finish. Recon reads only the code, routes and tests that reach the named behaviour.
- **Vary around the behaviour:** initial state (empty, partly filled, stale, already done), inputs (boundaries, invalid classes, Unicode, very large), timing (double submit, slow dependency, expired link or token), permissions (owner, other user, other tenant, logged out), and recovery (reload mid-flow, back button, retry after failure).
- Include at least one consequential outcome of the behaviour (what the user or the business gets when it works), checked end to end.
- Pull the matching check families from `knowledge/domains.md` (e.g. Forms, Functionality, State) and the lenses from `knowledge/specialists.md`.
- Every result has reproducible steps and evidence. Never change application source; confirmed findings get regression tests (full audit step 5).

## Common mistakes

- Only the happy path, once.
- Widening the scope to "while I'm here" checks the user did not ask for.
