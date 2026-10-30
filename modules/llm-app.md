# LLM app module (chat, RAG, agent)

Read when: the profile has an LLM surface: model SDK calls, prompt templates, a retriever or vector store, or tool/function calling. Its rows run in the backend/inputs lane (no extra lane, no extra subagent).

## Profile additions (file:line each, `none` where absent)

```
Model calls: <each SDK/HTTP call to a model: provider, paid?, stub switch (e.g. MOCK_LLM)>
Prompt inputs: <every place user text, uploaded files or retrieved chunks enter a prompt>
Model tools: <each tool the model can call, its side effects, what validates its arguments>
Retrieval: <store, tenant/user filter and where it is applied, how docs are deleted>
Eval setup: <promptfoo / DeepEval / Langfuse / RAGAS already in the repo, datasets, rubrics>
```

## Tests (include only rows the profile has)

| If profile has | Tests |
|---|---|
| Prompt inputs | injection through user text and through retrieved or uploaded content ("ignore previous instructions ..."); system prompt leak; model output rendered as HTML/markdown without sanitising |
| Model tools | injected text that makes the model call a tool the user could not call directly; hostile tool arguments (paths, URLs, SQL, huge values); side effects that run without confirmation; step and loop limits |
| Retrieval | cross-tenant retrieval (the filter must be in the query, not applied after); deleted or revoked doc still retrievable; empty retrieval -> says it does not know instead of inventing; citation whose source does not contain the claim; very large or many docs |
| Model calls | stub 429, 500, timeout, malformed JSON, empty content, truncated output, refusal: handled, no stack trace or prompt in the response; retry storms; token and cost blow-up from large input (`max_tokens`, input caps) |
| Any model call | same input N times: record N and how many differ or fail (temperature 0 is not deterministic); PII or secrets in prompts, logs and traces (e.g. Langfuse) |

Expected behaviour comes from the app's stated policy or spec, never from what the model answered. A judge model's score is not an oracle by itself: grade only against a rubric the user approved, and label those rows "model-graded" in the report next to the deterministic ones. Mark security rows "automated only".

## Tools

| Tool | Use it for | How |
|---|---|---|
| promptfoo (in the user's stack) | red-team plugins and repeated runs against a local/staging endpoint or the stub | use the installed one. `promptfoo redteam run -c <scratch>/promptfooconfig.yaml -o <scratch>/redteam.yaml -j 5`; `promptfoo eval -c <cfg> --repeat N -o <scratch>/results.json` (exit code 100 = a test failed). Not installed: ask first with the exact command |
| DeepEval / RAGAS / Langfuse | only where the project already uses them: reuse their datasets and metrics | no new config or datasets in the repo |

## Rules

- **Stub by default.** Behaviour rows run against the stub or a local model. Real model calls only under the approved paid-call cap. Count calls as tests x repeat x providers, plus judge-model calls and red-team generation calls, and split the cap across lanes as usual.
- **Config and state outside the repo.** Config, outputs and the tool's own history go to the scratch dir. promptfoo keeps eval history in a config dir under HOME: point it at the scratch dir (check the installed version's docs for the variable) so the user's real history is untouched.
- **Check where data goes.** Before running red-team generation on a private app, check whether the installed version calls a hosted service; if it does, the app's prompts leave the machine, so ask.
- **Test data only.** Never put real customer data in prompts, datasets or traces.
- Cite evidence per row: the transcript (input, retrieved chunks, tool calls, output), the run count, the stub hit count.

## Common mistakes

- Calling a model's answer correct because the judge model scored it high.
- One run of a nondeterministic path reported as pass or fail.
- Testing retrieval isolation with one tenant, or filtering after retrieval.
- Letting a red-team run reach real tools or real data.
