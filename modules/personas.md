# Persona journeys

Read when: an assessment, issue hunt or full audit includes persona-led exploration. Adapted from MIT-licensed material; see `THIRD-PARTY-NOTICES.md`.

A persona journey is a goal-driven walk through the app as a particular kind of user, seen through one or more lenses from `knowledge/specialists.md`. It finds what checklists miss: confusing steps, dead ends, wrong assumptions about what users know.

## Pick personas from the profile

- Start from a real goal in the profile's Journeys ("a first-time buyer wants to order one coffee with oat milk"), not a demographic.
- Choose personas whose differences matter here: first-time vs returning, careless vs careful, keyboard-only, slow connection, another locale, low permission vs admin, a hostile user probing limits.
- Assign the lenses that fit (e.g. Checkout + Error UX + Accessibility). A lens is a point of view and a checklist; it is not an extra agent, and the report must not imply more agents ran than did.

## Walk and record

Who walks: the lead, in Claude in Chrome for web UI, after lanes return (`modules/web-ui.md`); a lane may walk API or CLI personas. Record each persona as:

| Field | What |
|---|---|
| id | stable ID |
| lens | the lens or lenses used |
| intent | the goal, in the persona's words |
| journey | the ordered steps actually taken |
| reaction | what happened from the persona's point of view: helpful success, friction, confusion, dead end, unexpected delight |
| evidence | screenshot paths, responses, console or log lines |

- Record only reactions grounded in something observed. Never fabricate a reaction, and never call simulated reactions user research.
- A confusion or dead end that blocks the goal is a finding (Usability or Error UX); a crash or wrong result is a finding in its own domain.

## Common mistakes

- Personas defined by age or job with no goal, so the walk tests nothing specific.
- Writing what a persona "would feel" about a page that was never opened.
