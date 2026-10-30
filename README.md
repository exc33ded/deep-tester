# deep-tester

A [Claude Code](https://claude.com/claude-code) skill that tests a running application the way an experienced QA lead would. It reads the code first, plans what is worth testing, asks before anything risky, runs the checks, and writes an evidence-backed report plus regression tests for every bug it confirms.

It works on web apps, HTTP APIs, workers, CLIs, RPC/MCP servers, installers and plugins, and LLM/RAG features. It never changes your application code.

## What it does

| Command | Mode | Use it for |
|---|---|---|
| `/deep-tester` or `/deep-tester full` | Full audit | The whole app: parallel lanes (backend, tenancy and concurrency, load, CLI/installer), a load ramp, browser journeys |
| `/deep-tester assess [target]` | Assessment | "Test this", "is it ready to ship": about 20 checks chosen by consequence, no load |
| `/deep-tester quick [target]` | Quick pass | A first look: up to 5 checks in a few minutes |
| `/deep-tester focus <behaviour>` | Focused | One feature, flow, API or change ("password reset", "cart totals") |
| `/deep-tester hunt <area>` | Issue hunt | Bug hunting with stateful multi-step journeys and persona-led exploration |
| `/deep-tester a11y [pages]` | Accessibility | Keyboard, focus, dialogs, zoom/reflow, alt-text meaning, mapped to WCAG 2.2 |
| `/deep-tester report [run-id]` | Report / map | A self-contained HTML report and page map of a run |
| `/deep-tester background` | Background checks | Opt-in small local checks after code changes |
| `/deep-tester demo` | Demo | Copies a bundled practice app to test against |
| `/deep-tester help` | Help | Lists the modes and suggests the smallest useful next run |

Plain requests work too: "deep test my checkout", "is this branch ready?", "find bugs in sign-in".

## How a run works

1. **Recon.** Reads manifests, routes, config and existing tests, then writes an app profile with every risk tied to a `file:line`.
2. **Interview.** Asks only what the code could not answer: is the target local or staging, the paid-call cap, whether writes are allowed.
3. **Plan and gate.** Shows a test matrix with cost and risk per row, and waits for your yes.
4. **Run.** Uses subagents for lanes where it pays off; load is a generated driver script, not "N agents".
5. **Regression tests.** One expected-to-fail test per confirmed finding, in your project's own framework, in a new folder.
6. **Report.** `TEST-AUDIT.md` with a verdict (SHIP / SHIP WITH FIXES / DO NOT SHIP / INCONCLUSIVE), findings rated by fixed rules, evidence for every claim, and a "Not run / why" list.
7. **Clean up.** Stops every process it started and frees the ports.

## Safety rules (every mode)

- **Never changes the app.** Bugs are logged, never fixed. The only repo writes are the report and new regression tests.
- **Production is refused.** A "local" app wired to a shared database is called out and confirmed with you.
- **Paid and third-party calls are stubbed by default**, with real calls only under a cap you approve. It never load-tests someone else's service.
- **Secrets are never printed**: env files are read for variable names only.
- **Asks before installing anything**, with the exact command.
- **Side effects are contained**: installers and hooks run against a scratch HOME or a container.
- **Honest coverage**: a skipped check is never reported as a pass, and any approved check that did not run is named in the reply.

## Install

Copy the folder into your Claude Code skills directory:

```bash
# macOS / Linux
git clone https://github.com/exc33ded/deep-tester ~/.claude/skills/deep-tester

# Windows (PowerShell)
git clone https://github.com/exc33ded/deep-tester "$env:USERPROFILE\.claude\skills\deep-tester"
```

Start a new Claude Code session and run `/deep-tester help`.

**Requirements:** Claude Code. Node.js 18+ for the HTML report renderer, and 22+ for the optional background checks. Python 3 for the optional demo kit. Testing tools such as Playwright MCP, k6 or axe are suggested per module and only added after you agree.

## Layout

```
SKILL.md                 entry point: modes, hard rules, the 7-step flow
lane-brief.md            what a lane subagent is told
report-template.md       TEST-AUDIT.md template, severity and verdict rules
modules/                 loaded only when the app profile needs them
  backend.md  concurrency.md  load.md  web-ui.md  cli-rpc.md  installer-hooks.md
  llm-app.md  regression-tests.md
  assessment.md  focused-test.md  issue-hunt.md  personas.md  accessibility.md
  evidence-report.md  background-checks.md  demo.md
knowledge/               24 specialist lenses, 21 testing domains, WCAG 2.2 criteria
scripts/render-report.mjs   evidence.json -> report.html + map.html (no dependencies)
vendor/background/       opt-in background-check engine and its tests
vendor/demo/             demo script and five practice apps
```

## Status

The full-audit flow has been used on real projects. The assessment, quick, focused, hunt, a11y, report, background and demo modes are newer. The report renderer is tested. The background engine and demo script are syntax-checked: run `node --test vendor/background/*.test.mjs` before enabling background checks.

## License

MIT, see [LICENSE](LICENSE). Parts of the assessment, persona, accessibility, evidence, background-check and demo material are adapted from CARBON Free by testers.ai and Jason Arbon (MIT). [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) lists what was adapted and how. This project is not affiliated with or endorsed by testers.ai.

## See also

[test-case-generator](https://github.com/exc33ded/test-case-generator): the companion skill that writes test files at code level, finding edge cases and the places where code breaks.
