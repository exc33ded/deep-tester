# Web UI module (browser / frontend)

Read when: the profile is web-ui, or UI is in scope.

## Journey walkthrough (Claude in Chrome, by the lead after lanes return)

Act as a real user: walk each approved Journey from the profile start to finish through the UI only (clicks and typing in the app's own fields), and check the final state matches the expected end state (the item exists, the total is right, the page says what the button promised). Record each walk with `gif_creator` (extra frames before and after each action) or screenshots; cite the path. One Journey at a time, one user.

- Chrome is the user's real browser with real sign-ins: confirm the target URL is local/staging before the first navigation, open a new tab, never touch other tabs.
- Use a session the user already signed into with a test account; never type a password, never read cookies or storage. Not signed in -> ask the user.
- Delete/confirm buttons can open a JS dialog that freezes the extension. Warn the user before such a step, or leave it under "Not run".

## Tests

smoke (console errors, 4xx/5xx), forms valid/invalid, nav, each action's final state matches its label, 375/768/1440 widths, keyboard/a11y, each locale; Core Web Vitals vs LCP < 2.5s, CLS < 0.1, INP < 200ms. Multi-user flows (two roles, two tenants at once) only with isolated contexts. Mark accessibility rows "automated only"; for a real accessibility pass (keyboard, focus, dialogs, zoom, alt-text meaning, WCAG 2.2 criteria) use `modules/accessibility.md`. Persona walks: `modules/personas.md`.

## Tools

| Tool | Use it for | Add with (after a yes) |
|---|---|---|
| Claude in Chrome | Journey walkthrough, screenshots, GIFs | already present if connected |
| Playwright MCP | multi-user browser sessions (isolated contexts) | `claude mcp add playwright -- npx -y @playwright/mcp@0.0.83` |
| Chrome DevTools MCP | performance traces, Core Web Vitals, throttling, network | `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@1.10.1` |
| axe CLI | automated a11y pass per page | `npx -y @axe-core/cli@4.14.0 <url>` (needs Chrome) |

A newly added MCP server loads in a new session: tell the user to restart, or run those tests in the next session.

## Rules

- **Chrome = one profile, shared cookies.** Claude in Chrome is for sequential single-user walkthroughs by the lead, never by a lane subagent. Multi-user browser sessions need isolated contexts (Playwright). Desktop GUIs and TUIs: manual check or "Not run".
- Frontend kill-switches (demo mode, mock API, auth bypass flags in env or build config) must be off; if on, the affected rows go under "Not run".
- Screenshots: `computer` action `screenshot` with `save_to_disk: true` returns a file path; cite it. Redact anything sensitive.
- Stop and ask after 2-3 failed browser attempts.

## Common mistakes

- Calling the app "accessible" from an automated pass alone.
- Running two "users" in one Chrome profile and reading shared cookies as a bug (or as isolation).
