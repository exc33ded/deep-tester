# Accessibility

Read when: `/deep-tester a11y`, or a web-ui profile has accessibility in scope beyond the automated row in `modules/web-ui.md`. Adapted from MIT-licensed material; see `THIRD-PARTY-NOTICES.md`.

Use real observations from source, DOM and the browser. A rules scan alone is not WCAG conformance.

## Tests

| Area | What to check |
|---|---|
| Names and roles | every control has an accessible name and the right role; icon-only buttons; links vs buttons |
| Keyboard | every action reachable and operable by keyboard; logical tab order; no keyboard trap |
| Visible focus | focus is visible on every focusable element, and not hidden behind sticky headers |
| Dialogs | focus moves into a dialog on open, stays inside, and returns to the trigger on close; Esc closes; the dialog has a name |
| Status and errors | status messages and dynamic errors are announced (live regions), tied to their field, and say how to fix |
| Text alternatives | alt text exists **and** is accurate and useful for its context; decorative images are hidden |
| Zoom and reflow | 200% text resize and 400% zoom (320 CSS px width): no clipped text, overlap or horizontal scrolling for text content |
| Dynamic states | loading, empty, error and success states are perceivable without colour alone |

Map each result to its criterion in `knowledge/wcag22.md` (target level AA; note relevant AAA items).

## Tools

The `modules/web-ui.md` tools apply (Claude in Chrome for walks, axe CLI for an automated pass, Playwright for isolated contexts), each added only after a yes. A virtual screen-reader probe is optional if already available; a simulation never substitutes for real assistive technology.

## Rules

- Record the viewport, font size and zoom settings you change, and restore them after.
- Report criterion-level evidence: criterion, page or component, what was observed, evidence path. Criteria not checked are "not assessed", never passing.
- This is not legal certification or a conformance claim. Say so in the report section.

## Common mistakes

- Calling a page accessible because axe found no violations.
- Checking that alt text exists without reading whether it is right.
- Forgetting to restore zoom, so later screenshots are wrong.
