# Installer / hooks / plugin module

Read when: the profile is installer or hooks/plugin, or anything writes to HOME, shell rc files, or user config (including `postinstall` scripts).

## Tests

| If profile has | Tests |
|---|---|
| Installer | install -> reinstall -> uninstall round-trip in scratch HOME, leftovers, interrupted install, re-run appends duplicates? |
| Hooks / plugin | per-call latency, malformed payloads, failure does not block the host, behaviour when the hook binary is missing |

## Rules

- **Scratch HOME, every time.** Point HOME at a scratch dir, plus the per-OS variables the tool reads:
  - Linux: `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, `XDG_CACHE_HOME`, `XDG_STATE_HOME`.
  - macOS: HOME covers `~/Library/...` for most tools; check for hard-coded `/Users/...` paths.
  - Windows: `USERPROFILE`, and `APPDATA`/`LOCALAPPDATA` if the tool uses them.
  Use a container (or VM) if the tool ignores these.
- **System-level writes are not contained by a scratch HOME.** If the target touches them, run it in a container or VM (Windows Sandbox on Windows), else "Not run":
  - Linux: `/etc`, `/usr/local`, systemd units (incl. `--user`), cron.
  - macOS: `/Library`, `/usr/local` or `/opt/homebrew`, launchd agents/daemons, Keychain.
  - Windows: registry, PATH via `setx`, Start menu, services, scheduled tasks.
- List the real HOME entries the target could touch before the run and compare after; any change is a CRITICAL finding against the test itself, reported as such.
- Package-manager lifecycle scripts (`postinstall`, `prepare`) are code execution: third-party ones run only with explicit approval, and only in scratch HOME.

## Common mistakes

- Running an installer or hook against the real HOME.
- Overriding HOME but not USERPROFILE on Windows, or not the XDG variables on Linux.
- Testing the install on one OS and reporting it as working on all the OSes it supports.
