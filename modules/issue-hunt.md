# Issue hunt (stateful and persona-led exploration)

Read when: `/deep-tester hunt <area>`, or the user wants bugs found ("find bugs in sign-in", "break the checkout"), not a checklist. Adapted from MIT-licensed material; see `THIRD-PARTY-NOTICES.md`.

Follow `modules/assessment.md` for target, gate, budget, evidence and finish. What changes is where the time goes.

## Budget split

- At least **50%** of the run budget goes to **executed** multi-step exploration: at least **25%** to stateful journeys and at least **25%** to persona-led exploration (`modules/personas.md`). At 20 minutes: 5 minutes each, minimum.
- Setup, reading code and writing persona prose do not count toward those shares.
- Record each lane's start time, end time and what it ran, as evidence. If a share fell short, say so in the report and the chat reply.

## Where to hunt first

Prioritize, where the app has them:
- stale async results (a slow response overwriting a newer one);
- changes in one tab not reflected, or overwritten, in another;
- drafts lost on logout, session expiry or reload;
- deleted items still showing in search, lists or caches;
- personal data in telemetry, logs, URLs or analytics calls;
- payments left pending, or charged twice on retry or double submit;
- stock, holds or reservations that expire mid-flow;
- export then reimport that loses or changes data;
- focus lost or trapped after an action, and dialogs without an accessible name.

Then the profile's own Risks and the State and Reliability families in `knowledge/domains.md`.

## Rules

- Confirm each suspected issue safely before calling it reproduced: isolated synthetic data, test accounts, local or staging only. Never exploit real users or production data.
- A stateful journey is a sequence of real actions with the state checked between steps, not one request.
- Multi-user and multi-tab journeys need isolated browser contexts (Playwright), never two users in one Chrome profile (`modules/web-ui.md`).

## Common mistakes

- Spending the budget on a static checklist and calling it a hunt.
- Counting written persona descriptions as exploration time.
