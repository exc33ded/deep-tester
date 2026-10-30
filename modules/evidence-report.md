# Evidence file, HTML report and map

Read when: an assessment, quick, focused, issue-hunt or accessibility run starts (always), or a full audit wants the visual report. Also on `/deep-tester report [run-id]`, to show the report and map of a past run. Adapted from MIT-licensed material; see `THIRD-PARTY-NOTICES.md`.

`TEST-AUDIT.md` stays the main report. The evidence file is the structured record behind it, and the HTML report and map are views of it.

## Where it lives

`<scratch dir>/evidence/<run-id>/evidence.json`, with screenshots in `<scratch dir>/evidence/<run-id>/shots/`. Run ID: `dt-<yyyymmdd-hhmm>-<short slug>`. Nothing goes in the repo; copy `report.html` next to `TEST-AUDIT.md` only if the user says yes. Write the file at the gate and update it after each meaningful step, merging by stable `id`.

## Schema (`deep-tester.evidence/v1`)

```json
{
  "schema": "deep-tester.evidence/v1",
  "id": "dt-20261030-1530-checkout", "mode": "assessment",
  "title": "Checkout after the discount change", "target": "http://localhost:3000 (local)",
  "createdAt": "...", "updatedAt": "...",
  "status": "running",
  "current": "Checking saved cart survives reload", "why": "Customers lose their cart otherwise",
  "summary": "",
  "checks": [{"id": "save-reload", "title": "Saved cart survives reload", "domain": "State", "type": "recovery",
              "lane": "stateful", "risk": "Customers lose the cart", "steps": "Add 2 items, reload, open cart",
              "expected": "2 items remain", "status": "passed", "actual": "2 items remain after reload",
              "evidence": "shots/cart-after-reload.png", "page": "cart"}],
  "findings": [{"id": "f1", "title": "...", "severity": "HIGH", "strength": "demonstrated", "consequence": "...",
                "steps": "...", "evidence": "...", "remediation": "...", "verification": "...", "page": "cart"}],
  "pages": [{"id": "cart", "title": "Cart", "url": "/cart", "description": "...", "screenshot": "shots/cart.png"}],
  "journeys": [{"id": "j1", "title": "Buy one coffee", "intent": "...",
                "steps": [{"title": "Open menu", "page": "menu", "status": "passed", "evidence": "shots/menu.png"}]}],
  "personas": [{"id": "p1", "lens": "Checkout, Error UX", "intent": "...", "journey": "...", "reaction": "...", "evidence": "..."}],
  "blockers": ["No staging account for the admin role"],
  "confidence": {"score": 70, "scope": "...", "rationale": "...", "limitations": "..."}
}
```

Rules the renderer enforces (it exits non-zero and names the row):
- Check and journey-step status is one of `planned`, `running`, `passed`, `failed`, `blocked`, `deferred`. `passed`/`failed` need `actual` (checks) and `evidence`.
- Run status is `running`, `completed`, `partial`, `blocked` or `canceled`. `completed` is refused while any check is `planned` or `running`: mark those `deferred` or `blocked` first.
- Finding `severity` uses `report-template.md` levels; `strength` is `demonstrated`, `source-proven` or `suspected`.
- `confidence` needs `scope` and `rationale`; `score` is optional and 0-100. Leave it out when not defensible.
- Screenshots: PNG, JPEG or WebP, max 5 MB, inside the run folder. Authorized and redacted only: no secrets, tokens or real customer data. Link a check, finding or journey step to a page with `page` = the page `id` or `url`.

Evidence fields are references, not proof that a check ran. Never write `passed` for an unexecuted or merely generated test.

## Render

```
node <skill dir>/scripts/render-report.mjs <scratch dir>/evidence/<run-id>/evidence.json
```

Writes `report.html` and `map.html` beside the JSON: self-contained, screenshots embedded, opens offline. Node 18+ only, no packages. The **report** shows status, blockers, coverage by status, confidence, findings (reproduce, fix, verify), checks with evidence, journeys and personas. The **map** shows each captured page with its screenshot and the checks and findings linked to it, plus checks with no captured page. A map covers one run; it does not compare runs. With no screenshots, say so and offer to capture approved pages in a new run; never invent page images.

Give the user the path to `report.html` (and open it in the browser pane if the host has one). Review it for sensitive data before anyone shares it.

## Common mistakes

- Marking a check `passed` because a test file was generated.
- A map built from pages that were never actually visited.
- Screenshots of real customer data or tokens left in the evidence folder.
