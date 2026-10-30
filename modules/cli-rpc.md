# CLI / worker / RPC module

Read when: the profile is cli, worker, batch/pipeline or rpc/stdio server.

## Tests

| If profile has | Tests |
|---|---|
| CLI / worker / batch | bad args, unknown commands, large input, kill mid-run and restart, idempotency (rerun gives no duplicates), exit codes (errors must be non-zero), concurrent runs on the same state |
| RPC / stdio server | malformed and oversized messages, unknown methods, concurrent calls, client disconnect mid-call |

Load for these goes through `load.md` (parallel processes or N sessions).

## Rules

- Run the target from outside its own directory, with absolute paths, so a planted local binary or config is not picked up.
- If it writes to HOME or config, follow `installer-hooks.md` containment (scratch HOME) even for "just a CLI".
- After concurrent runs, verify the state file: line count matches expected, every record parses.

## Common mistakes

- Treating exit code 0 on bad input as a pass.
- Checking only that concurrent runs did not crash, not that no writes were lost or interleaved.
