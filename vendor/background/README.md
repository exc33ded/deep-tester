<!-- Adapted from CARBON Free (MIT); see THIRD-PARTY-NOTICES.md. -->
# deep-tester background checks

deep-tester helps the agent select testing at the right time and offers a quick first
assessment. Optional background checking starts only after a clear per-project choice.
An update never silently enables it. Ordinary testing still works without the hooks.

## Behavior and boundaries

- After a main-agent turn ends: wait 120 seconds. Any new prompt, tool action,
  permission request, interruption or session end cancels queued/running checks.
- Inspect changed, non-ignored source in a Git project. No changes means no run.
  No Git baseline means no automatic run; offer an explicit assessment instead.
- Check JSON and JavaScript syntax without executing the application. Other source
  types become deferred behavior checks. Optional exact local test commands require
  separate approval. These are not an exhaustive QA run or a release sign-off.
- Default 180 seconds; configurable to a hard maximum of 600. Shared single worker,
  30-minute per-project cooldown, three runs/day, ten reserved minutes/day. Reservations
  count even if cancelled or a child crashes; this favors predictable limits. UTC reset.
- No unchanged-code repeats. New edits cancel the current work through host activity
  events. Editing in an unrelated external editor is not a guaranteed idle signal.
- No browser control, network testing, load/stress activity, automatic fixes, dependency
  installation or evidence uploads. All local execution stays within opted-in projects.
- Local test commands can have side effects: approve only commands you trust to stay
  in disposable/local environments. The engine's process timeout is not a security sandbox.
  Automatic custom test commands and optional Claude review are macOS/Linux only;
  on Windows, only built-in non-executing syntax checks run automatically. This avoids
  promising descendant-process cancellation that Windows does not provide here.
- Default checks make zero model requests. Optional Claude source review makes one
  tool-free CLI turn, capped at 90 seconds and a $0.25 CLI budget threshold. No tools,
  MCPs, skills or hooks in that child. Provider billing/allowance still applies; provider
  caps may include the last in-flight response. Source excerpts are filtered and bounded,
  not guaranteed anonymized. Enable this only for code you may send to that provider.

## Controls

### One gentle reminder per chat

After 24 hours without a deep-tester run being requested in a chat, the agent asks whether you
want a run on the next user turn. First observation starts the clock; a fresh chat
is not immediately overdue. Chats are tracked independently using locally hashed
host session/thread IDs. Actual assessment skill invocations and the assessment-start
helper reset that chat's clock. A run request suppresses the nudge in that turn but
does not count as an executed invocation. At most one reminder per 24 hours;
it does not start testing or wake an idle agent. If a host changes its session ID,
it starts a new reminder clock. No thread ID or hooks means no automatic reminder.
Disable with `configure <project> '{"reminders":false}'`. Global pause also silences
reminders. A chat nudge can be enabled while background execution stays disabled.

Use `/deep-tester background` conversationally: “Enable background checks for this
project”, “Pause background checks”, “Disable background checks everywhere”, or
“Show what the background checks found”.

The helper commands are:

```
node <skill-dir>/vendor/background/engine.mjs status <project>
node <skill-dir>/vendor/background/engine.mjs configure <project> '{"enabled":true}' --approved
node <skill-dir>/vendor/background/engine.mjs configure <project> '{"aiReview":true}' --approved
node <skill-dir>/vendor/background/engine.mjs pause <project>
node <skill-dir>/vendor/background/engine.mjs off-everywhere <project>
node <skill-dir>/vendor/background/engine.mjs allow-projects <project>
node <skill-dir>/vendor/background/engine.mjs review <project>
```

Optional tests use an absolute executable and argument array, never an implicit shell:
`{"tests":[{"label":"Approved isolated unit tests","command":"/absolute/path/to/node","args":["--test","tests/unit.test.mjs"],"timeoutSeconds":60}]}`.
Only pass `--approved` after the person approves the specific behavior. No repo file
can opt a new user into background execution. Settings, reports and deduplicated
outcome counts are in `~/.config/deep-tester/background/v1/<project-hash>/`, not the repo.
`DEEP_TESTER_BACKGROUND=off` is an environment kill switch. Hook trust is controlled by the host.

## Host support

Claude Code: Stop and activity hooks added to settings with the user's approval (`modules/background-checks.md`); optional Claude CLI source review is
separate opt-in. Cowork: only where the host actually provides command-hook execution
and Node; otherwise manual assessment. Do not promise parity without a live host test.
Local Codex: supported trusted lifecycle command hooks, local deterministic/test checks;
no extra model provider required or invoked. Ordinary ChatGPT and Work Cloud without
local hook support: manual assessment only. No MCP server is involved.

Background results do not wake an idle model. The compact result is made available
at the next user turn/session; the report is immediately readable as local HTML.
This avoids spending more allowance merely to announce completion.

## Outcome measurement and privacy

Count completed assessments, reviewed findings and return days locally—not hook
firings as engagement. The `outcome` helper takes `assessment-completed` or
`finding-reviewed` plus a stable ID, deduplicates it, and stores no source or finding
text in the outcome ledger. These counts are not transmitted anywhere and cannot
be mistaken for marketplace-wide adoption. Existing edition telemetry remains separate.

If a machine/process crashes leaving `worker.lock`, pause checks and verify the PID in
that file is no longer running before removing that one lock file. The supervisor fails
closed rather than guessing that a second worker is safe. Hooks never block foreground
work on an error. Removing the hooks alone does not erase saved reports.
