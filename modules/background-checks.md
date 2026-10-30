# Background checks (optional, opt-in)

Read when: `/deep-tester background`, or the user asks for automatic checks after code changes, or to pause, disable or review them. Never set this up as part of a test run. The engine lives in `vendor/background/`. Adapted from MIT-licensed material; see `THIRD-PARTY-NOTICES.md`; the engine there was renamed and adapted for deep-tester. It was **not executed** during the port: read `vendor/background/README.md` and run its tests (`node --test vendor/background/*.test.mjs`) before enabling.

## What it does

After Claude Code finishes a turn and about two quiet minutes pass, the engine looks at changed, non-ignored files in a Git project and runs small local checks: JSON and JavaScript syntax without executing the app, plus any local test commands the user approved one by one. Any new prompt, tool action or session end cancels it. Limits: 180 s per run by default (hard max 600 s), one worker, 30-minute cooldown per project, 3 runs and 10 reserved minutes per UTC day across projects. No browser, network testing, load, fixes, installs or uploads. Results wait for the next turn; nothing wakes an idle session.

- State and reports: `~/.config/deep-tester/background/v1/<project-hash>/`, not the repo.
- Kill switch: environment variable `DEEP_TESTER_BACKGROUND=off`.
- Windows: only the built-in syntax checks run automatically; approved test commands and AI review are macOS/Linux only.
- Optional AI review (Claude Code, macOS/Linux): one tool-free `claude -p` call, 90 s, $0.25 budget cap, sends a filtered excerpt of changed source to the provider. Separate opt-in; uses the user's Claude allowance.

## Setup (ask first, every step)

This changes the user's Claude Code config, so the "Tools: ask before adding any" rule applies. Show the exact change and wait for a yes.

1. Node 22+ must be installed. Run the vendored tests first and show the result.
2. Add hooks to the user's `~/.claude/settings.json` (or the project's `.claude/settings.local.json`, if the user prefers per-project). Each event runs the engine with an absolute path:

```json
{"hooks": {
  "SessionStart":      [{"hooks": [{"type": "command", "command": "node \"<abs skill dir>/vendor/background/engine.mjs\" hook claude", "timeout": 5}]}],
  "UserPromptSubmit":  [{"hooks": [{"type": "command", "command": "node \"<abs skill dir>/vendor/background/engine.mjs\" hook claude", "timeout": 5}]}],
  "PreToolUse":        [{"hooks": [{"type": "command", "command": "node \"<abs skill dir>/vendor/background/engine.mjs\" hook claude", "timeout": 5}]}],
  "PermissionRequest": [{"hooks": [{"type": "command", "command": "node \"<abs skill dir>/vendor/background/engine.mjs\" hook claude", "timeout": 5}]}],
  "Stop":              [{"hooks": [{"type": "command", "command": "node \"<abs skill dir>/vendor/background/engine.mjs\" hook claude", "timeout": 5}]}],
  "SessionEnd":        [{"hooks": [{"type": "command", "command": "node \"<abs skill dir>/vendor/background/engine.mjs\" hook claude", "timeout": 3}]}]
}}
```

   Merge into existing hooks; never replace them. A new session loads the hooks.
3. Record consent for this project only after the user agrees: `node <engine> configure <project> '{"enabled":true}' --approved`. Installing the hooks is not consent, and no repo file can opt a user in.

## Controls

```
node <engine> status <project>
node <engine> configure <project> '{"enabled":true}' --approved
node <engine> configure <project> '{"tests":[{"label":"Unit tests","command":"/abs/path/to/node","args":["--test","tests/unit.test.mjs"],"timeoutSeconds":60}]}' --approved
node <engine> configure <project> '{"aiReview":true}' --approved
node <engine> configure <project> '{"reminders":false}'
node <engine> pause <project>
node <engine> off-everywhere <project>
node <engine> allow-projects <project>
node <engine> review <project>
```

- **Test commands:** absolute executable plus argument array, never a shell string. Before `--approved`, show the exact command, project and side effects. Only isolated local tests with no live services or production credentials; a script name in `package.json` is not proof of safety. The engine's timeout is not a sandbox.
- **AI review:** ask separately; explain that source excerpts go to the model provider and use the user's allowance. Never on code they may not send out.
- **Reminders:** with the hooks on, after 24 hours without a `/deep-tester` run in a chat, the next turn may get one short offer to run a suggested mode (e.g. `/deep-tester focus`). It is a question, not permission. `reminders:false` or `off-everywhere` stops it.
- `off-everywhere` stops all projects including running work; `allow-projects` only lifts that global pause and enables nothing new.
- A stale `worker.lock` after a crash: pause, confirm the PID in it is not running, then remove only that file.

## Results

When the user asks what was found: run `review <project>`, give one short summary (passed / failed / deferred, the strongest actionable finding, the next behaviour check), and offer the `latest.html` report, `/deep-tester focus` on the finding, or pausing. Never auto-fix. Source inspection is not browser testing. A timeout, cancellation or provider failure is partial or blocked, never a pass.

## Uninstall

Remove the six hook entries from settings, and if wanted run `off-everywhere`. Saved reports stay in `~/.config/deep-tester/background/` until the user deletes them.
