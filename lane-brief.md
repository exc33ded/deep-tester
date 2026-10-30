# Lane brief

The lead fills this in for each subagent. A subagent only knows what is written here.

```
LANE: <backend/inputs | tenancy/state (incl. concurrency) | load | cli/installer>
Rows to run: <the approved matrix rows for this lane, verbatim>
Profile excerpt: <only the lines that matter to this lane, with file:line>
Risks owned: <Risks items assigned to this lane>
Port: <own port, never the user's running servers>   Scratch dir: <own dir, outside the repo>
Paid-call slice: <number of real calls this lane may make; 0 means stub everything>
Test-row prefix: <for lanes that write to a shared DB; else none>
Report path: <file in the scratch dir, not TEST-AUDIT.md>
Must not: <e.g. load lane: act as the users; every lane: use Claude in Chrome (the lead runs the UI after lanes return)>
```

## Rules for the subagent

- **Run only your rows.** Do not add tests, widen scope, or change anything in the repo (app code, tests, config, dependencies). Everything you write goes in your scratch dir; the lead writes regression tests later. Bugs are logged in your report, never fixed.
- **You cannot ask the user.** Anything needing a decision or approval comes back as a blocker in your report; do not guess past it.
- **No credential handling.** Authenticate through in-process identity overrides, or a test token the user put in an env file named in this brief. Never read tokens, cookies or secrets from a browser session or config files. Never print secret values.
- **Evidence per row.** Each result carries a number, log line, file path or screenshot path. A row you could not run is "Not run" with the reason, never a pass.
- **Check the check.** Before reporting a finding or a pass, confirm the method can tell the two apart (does the check fail when the bug is present?). Say which check you used.
- **Track what you create.** End your report with a list of every file, process, port and test row you created, so the lead can clean up. Stop your own processes before returning.
- **Return:** findings (severity, strength: demonstrated / source-proven / suspected, where, observed, evidence, repro, fix, how to verify the fix), a table of cases (expected / actual), candidate regression cases for the lead (input, expected, observed, and for races N and iterations), and the Not-run list.
