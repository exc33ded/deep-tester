# Regression tests module

Read when: the run produced confirmed findings (always; no interview question).

Turns each confirmed finding into a runnable test in the project's own framework, so the bug cannot come back silently.

## What to write

- One test per confirmed finding that a deterministic test can express (bad input -> 500, missing auth check, cross-tenant read, wrong exit code, leftover files, error swallowed when a dep returns 500). The test asserts the **correct** behaviour, so it fails today.
- Load, latency and memory findings are not unit tests: keep their driver script and command under "Reproduction" instead.
- Races are: a barrier-based test (see `concurrency.md`) that releases N callers at once, repeats K times, and asserts the invariant. Record N and K, and how many of K failed today.
- Name each test after the finding and reference its number in `TEST-AUDIT.md`, e.g. `rejects body without "text" (TEST-AUDIT #2)`.

## Rules

- **Project's framework and conventions only.** Detect them in recon (package.json scripts, `vitest`/`jest`/`playwright` config, `pytest.ini`/`pyproject`, `go test`, `cargo test`), copy the style of an existing test, reuse its fixtures and helpers. No framework in the project -> use the runtime's built-in runner inside the new folder (`node --test`, `python -m unittest`, `go test`, `cargo test`), adding no dependency; else "Not run".
- **Third-party repo:** running tests executes its test config (conftest, jest globalSetup). Write the tests, but run them only with approval (untrusted-repo rule); unrun ones are marked "not run" in the report.
- **Own folder in the repo's test dir.** Write them to a new subfolder (e.g. `tests/deep-tester/`) so the project's runner picks them up. Never edit existing tests, fixtures or app code; if a fixture is missing, write it inside the new folder.
- **Offline and deterministic.** Reuse the run's stubs or the project's mocks; no real paid or third-party calls, no shared DB, no sleeps for timing (race tests use a barrier, not sleeps).
- **Mark them expected-to-fail** so the suite stays green until the fix, then flips red to remind someone to drop the marker: vitest `test.fails`, jest `test.failing`, Playwright `test.fail()`, pytest `@pytest.mark.xfail(strict=True, reason="TEST-AUDIT #N")`. No such marker (Go, Rust): skip with the finding number in the reason (`t.Skip`, `#[ignore = "TEST-AUDIT #N"]`).
- **Prove each one fails for the right reason.** Run it once without the marker: it must fail on the finding's assertion, not on an import, fixture or setup error. A test that passes today means the finding or the test is wrong; recheck before reporting.
- Run the whole new set with the marker on and record the result.

## Report

Add a "Regression tests" section: file, test name, finding number, "fails today on <assertion>" (evidence), run command.

## Common mistakes

- Asserting today's buggy behaviour (that locks the bug in).
- A marked test that "fails as expected" only because it cannot import or connect.
- Writing tests in a new framework or style the project does not use.
