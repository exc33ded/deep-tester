# Third-party notices

deep-tester includes material adapted from **CARBON Free** (also called CARBON Light) by testers.ai and Jason Arbon.

- Source: https://github.com/jarbon/carbon-free, commit `2c6b8af9a31cb718859b1bbe43ffdcd7b2714833` (version 1.32.22-free.17, 2026-10-10).
- License: MIT (full text below; also in `vendor/LICENSE` with the upstream `vendor/NOTICE.md`). Upstream notice: "Required Notice: Copyright 2026 testers.ai and Jason Arbon (https://testers.ai). CARBON Light (Free) is open source under the MIT License. LICENSE controls. No trademark or portrait endorsement rights are granted. This license does not apply to CARBON Pro."
- deep-tester is not affiliated with or endorsed by testers.ai. The CARBON and Jay names, logo and portraits are not used: commands, file names, environment variables, config paths and messages were renamed to deep-tester's own. The upstream names appear only in this file, `vendor/NOTICE.md` and one credit line in each adapted file. Nothing from CARBON Pro is included.

## What was adapted, and how

| Upstream part | In deep-tester | Change |
|---|---|---|
| Broad assessment command, `references/free-testing.md`, `references/carbon-target.md`, `background/first-use.md` | `/deep-tester assess` and `/deep-tester quick`: `modules/assessment.md` | Rewritten as instructions; MCP tool calls replaced by the evidence file; fitted to deep-tester's hard rules and gates |
| Focused-test command | `/deep-tester focus`: `modules/focused-test.md` | Rewritten |
| Issue-hunt command | `/deep-tester hunt`: `modules/issue-hunt.md` | Rewritten |
| Persona and specialist model | `modules/personas.md` | Rewritten; persona names and avatars dropped |
| Accessibility command, `references/wcag22-criteria.json` | `/deep-tester a11y`: `modules/accessibility.md`, `knowledge/wcag22.md` | Rewritten; criteria data unchanged |
| `references/specialists.json`, `references/testing-domains.json` | `knowledge/specialists.md`, `knowledge/domains.md` | Generated from the JSON; data unchanged, avatars and command fields dropped |
| Evidence model (start/update/report tools), map command, `server/view.mjs` | `/deep-tester report`: `modules/evidence-report.md`, `scripts/render-report.mjs` | Same field model and rules; the renderer is new code, no MCP server |
| Background command, `background/engine.mjs` and its tests and README | `/deep-tester background`: `modules/background-checks.md`, `vendor/background/` | **Modified:** renamed (env `DEEP_TESTER_BACKGROUND*`, config `~/.config/deep-tester/background/v1`, messages, report page, review prompt); suggests and detects `/deep-tester` modes instead of upstream commands; reads its mode list from code instead of a plugin `skills/` folder (which does not exist in a skill and would have thrown); tests updated to match |
| Demo command, `runtime/carbon/scripts/carbon_demo.py`, `demo-fixtures/` | `/deep-tester demo`: `modules/demo.md`, `vendor/demo/scripts/demo.py`, `vendor/demo/demo-fixtures/` | **Modified:** script renamed; schemas, descriptor (`.deep-tester-demo.json`), destination prefix, messages and fixture docs renamed; `CARBON_DEMO_URL` renamed `DEMO_URL` in the two Playwright specs. TestBucks app files unchanged |
| Help, settings and conversational entry points | `/deep-tester help`, budget section of `modules/assessment.md`, "Talking about results" | The behaviour kept; the persona and voice not ported |

Not ported: usage and Fathom analytics, the MCP server and its live report UI, plugin manifests and hooks files, images of the persona and specialists, the raw `references/*.json` files (the `knowledge/` files carry the same data), and the Pro navigation command.

The adapted code under `vendor/` was reviewed by reading and syntax-checked (`node --check`, `py_compile`), not executed, during the port. Run its tests before enabling it: `node --test vendor/background/*.test.mjs`.

## MIT License (CARBON Free)

MIT License

Copyright (c) 2026 testers.ai and Jason Arbon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
