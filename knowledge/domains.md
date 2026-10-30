<!-- Adapted from MIT-licensed material; see THIRD-PARTY-NOTICES.md. -->

# Testing domains

Read when: building the matrix (step 3) and you need the check families for a quality area the profile touches. Include only domains the profile has; each domain's safety line adds to, never replaces, the hard rules in `SKILL.md`. Load and stress here mean read-only risk review unless the `modules/load.md` lane was approved.

| Domain | Purpose |
|---|---|
| [GEO and AI Search](#geo) | Evaluate AI-search discoverability, technical eligibility, useful grounded answers, entity credibility and truthful structured data; distinguish local readiness from observed engine citations. |
| [Agent Readiness](#agentic) | Evaluate how agents discover, understand and safely operate a website, API or tool interface through consumer-first tasks, semantics, contracts and recovery; not a model evaluation or SEO certification. |
| [Functionality](#functionality) | Verify the product does the promised work across happy paths, negative paths, state transitions, boundaries, recovery, concurrency, permissions, and integrations. |
| [User Interface](#ui) | Find visual and interaction defects in layout, hierarchy, consistency, controls, states, responsiveness, feedback, and polish. |
| [User Experience](#ux) | Evaluate whether realistic users can understand, complete, recover from, and trust important journeys. |
| [Usability](#usability) | Exercise realistic tasks with representative perspectives and record friction separately from deterministic defects. |
| [Accessibility and WCAG](#accessibility) | Find barriers to disabled users and produce criterion-level WCAG 2.2 evidence without treating automation alone as conformance proof. |
| [Privacy](#privacy) | Trace personal and sensitive data through collection, display, logs, requests, storage, sharing, retention, consent, deletion, and AI use. |
| [Security](#security) | Test product, web, and API trust boundaries with safe, authorized probes and source-aware threat hypotheses. |
| [Load Testing](#load) | Deeply inspect code and server/deployment configuration read-only for likely load failures; assess readiness, capture approved journeys and run staged replay only within explicitly approved limits. Static hypotheses are not measured capacity. |
| [Stress Readiness and Recovery](#stress) | Review source/server configuration read-only and test explicit stress hypotheses using bounded isolated local loops or separately approved external scenarios, measuring correctness and recovery as well as pressure. |
| [Performance](#performance) | Measure user-visible speed and system behavior under realistic data, device, network, concurrency, and duration conditions. |
| [Networking](#networking) | Verify protocol, request, response, caching, connectivity, timeout, retry, offline, proxy, and dependency behavior. |
| [State Integrity and Round Trips](#state) | Find inconsistent, lost, stale or invalid state through source inspection and bounded multi-step, multi-tab, independent-user/API and export/reimport scenarios, including invalid-load and recovery behavior. |
| [Reliability and Resilience](#reliability) | Challenge continuity, consistency, recovery, observability, and truthfulness under dependency failures, restarts, races, and repeated use. |
| [Compatibility](#compatibility) | Verify important behavior across supported browsers, engines, devices, viewports, input modes, operating systems, and integration versions. |
| [Content](#content) | Check content truth, clarity, structure, completeness, consistency, credibility, navigation, errors, media, and responsive readability. |
| [Data Integrity](#data) | Trace input, validation, transformation, persistence, synchronization, migration, export, deletion, and authorization of important data. |
| [API](#api) | Exercise API contracts, auth, inputs, outputs, errors, versions, state, concurrency, security, performance, and consumers. |
| [Internationalization Readiness and Completion](#intl) | Assess engineering readiness and evidence-qualified completion against the app's intended locales, markets, requirements and critical journeys, separately from linguistic translation review. |
| [Localization and Internationalization](#localization) | Find internationalization blockers and contextually incorrect translations by connecting source strings and locale catalogs to actual screen states, actions, terminology, and user consequences. |

<a id="geo"></a>
## GEO and AI Search

Evaluate AI-search discoverability, technical eligibility, useful grounded answers, entity credibility and truthful structured data; distinguish local readiness from observed engine citations.

- **Lenses:** News & content, Content, Legal policy
- **Evidence to collect:** page text, source, dom, screenshots, response headers, robots and sitemaps, structured data, query evidence matrix, authorized search analytics
- **Also called:** generative-engine-optimization, ai-seo, aeo, answer-engine-optimization, ai-search
- **Safety:** Read-only bounded public or authorized inspection. No private exposure, indexing submission, account/CDN changes, training opt-in, search-UI bypass, paid service or private-content upload without authorization. No guaranteed visibility or invented metrics.
- **Check families:**
  - crawl indexing and snippet eligibility
  - search versus training access controls
  - intent-specific answerability and extraction
  - entity identity credibility freshness and source evidence
  - structured-data truth and locale consistency
  - observed citations and first-party measurement boundaries
  - site sampling and comparable trends
  - prioritized improvements without deceptive optimization
- Guidance last checked upstream: 2026-09-12

<a id="agentic"></a>
## Agent Readiness

Evaluate how agents discover, understand and safely operate a website, API or tool interface through consumer-first tasks, semantics, contracts and recovery; not a model evaluation or SEO certification.

- **Lenses:** Accessibility, Performance, Security
- **Evidence to collect:** live ui, screenshots, accessibility tree, dom, source, openapi or schema, requests, responses, tool contracts, journey trace
- **Also called:** agent-friendly, agent-readiness, agent-usability, machine-usability, webmcp
- **Safety:** Use isolated local contexts and synthetic data. Preserve authentication and approval boundaries; no CAPTCHA bypass, cloud upload, browser flag changes, installs, or consequential tool calls without authorization. Agent friendliness does not require public access.
- **Check families:**
  - consumer-specific discovery and content comprehension
  - semantic names roles labels and entity disambiguation
  - structured data and visible-content agreement
  - API and tool contract discoverability and correctness
  - multi-step task execution and independent outcome verification
  - state identity timing and recovery
  - human intervention and safe consequential actions
  - applicable standards versus optional experimental enhancements
- Guidance last checked upstream: 2026-09-12

<a id="functionality"></a>
## Functionality

Verify the product does the promised work across happy paths, negative paths, state transitions, boundaries, recovery, concurrency, permissions, and integrations.

- **Lenses:** Forms, Error UX, AI-generated code
- **Evidence to collect:** source, live ui, dom, console, network, api, data state, screenshots
- **Also called:** functional, behavior, logic, pure-functionality
- **Check families:**
  - promised task outcomes
  - positive and negative paths
  - empty null malformed and extreme inputs
  - boundaries and state transitions
  - permissions and role behavior
  - retry idempotency and concurrency
  - failure recovery and truthful status
  - downstream and upstream integration effects

<a id="ui"></a>
## User Interface

Find visual and interaction defects in layout, hierarchy, consistency, controls, states, responsiveness, feedback, and polish.

- **Lenses:** Usability, Content, Landing pages
- **Evidence to collect:** screenshots, dom, computed style, responsive viewports, interaction states, source
- **Also called:** visual-ui, interface, visual
- **Check families:**
  - layout and alignment
  - hierarchy and readability
  - control affordance and consistency
  - hover focus active disabled loading empty and error states
  - responsive reflow and clipping
  - spacing typography imagery and iconography
  - theme and contrast behavior
  - cross-page visual consistency

<a id="ux"></a>
## User Experience

Evaluate whether realistic users can understand, complete, recover from, and trust important journeys.

- **Lenses:** Usability, Error UX, Landing pages
- **Evidence to collect:** live ui, screenshots, journey trace, content, errors, timing
- **Also called:** experience, journey, flow-ux
- **Check families:**
  - task clarity and mental model
  - discoverability and navigation
  - flow length and unnecessary work
  - feedback and progress
  - error prevention and recovery
  - trust and expectation matching
  - first-time and returning-user differences
  - interruption resume and cross-device continuity

<a id="usability"></a>
## Usability

Exercise realistic tasks with representative perspectives and record friction separately from deterministic defects.

- **Lenses:** Usability, Error UX
- **Evidence to collect:** live ui, screenshots, persona observations, task timing, navigation, errors
- **Also called:** ease-of-use, user-testing, human-factors
- **Check families:**
  - learnability
  - efficiency
  - memorability
  - error rate and recovery
  - satisfaction and confidence
  - terminology and comprehension
  - keyboard and touch efficiency
  - persona-specific friction

<a id="accessibility"></a>
## Accessibility and WCAG

Find barriers to disabled users and produce criterion-level WCAG 2.2 evidence without treating automation alone as conformance proof.

- **Lenses:** Accessibility, WCAG
- **Evidence to collect:** live ui, screenshots, dom, accessibility tree, computed style, keyboard trace, source, virtual screen reader transcript
- **Also called:** a11y, wcag, inclusive-design
- **Check families:**
  - perceivable text media structure and contrast
  - operable keyboard focus target size motion and timing
  - understandable language labels instructions errors and consistency
  - robust name role value status and assistive-technology semantics
  - zoom reflow orientation and responsive access
  - complete processes and materially different page states
  - manual checks that automation cannot decide

<a id="privacy"></a>
## Privacy

Trace personal and sensitive data through collection, display, logs, requests, storage, sharing, retention, consent, deletion, and AI use.

- **Lenses:** Privacy, GDPR, Cookie consent, Legal policy
- **Evidence to collect:** live ui, screenshots, network, console, storage metadata, source, policies, data flow
- **Also called:** pii, data-protection, ccpa, gdpr
- **Check families:**
  - personal-data inventory and minimization
  - consent purpose and withdrawal
  - tracking before and after choice
  - display URL log and error leakage
  - storage retention export deletion and correction
  - third-party transfer and regional handling
  - privacy policy versus observed behavior
  - AI prompt training memory and generated-output exposure

<a id="security"></a>
## Security

Test product, web, and API trust boundaries with safe, authorized probes and source-aware threat hypotheses.

- **Lenses:** Security, OWASP
- **Evidence to collect:** source, live ui, network, headers, cookies, console, api, dependencies
- **Also called:** appsec, owasp, secure
- **Safety:** Default to non-destructive review and benign probes. Hostile, privilege, denial-of-service, data-exfiltration, or production-impacting tests require explicit authorization, scope, limits, safe identities, and recovery.
- **Check families:**
  - authentication authorization and tenant isolation
  - session cookie token and logout safety
  - injection and output encoding
  - secrets and sensitive-data exposure
  - transport CORS CSP and security headers
  - dependency and supply-chain risk
  - rate limits abuse resistance and resource bounds
  - audit logging monitoring containment and recovery

<a id="load"></a>
## Load Testing

Deeply inspect code and server/deployment configuration read-only for likely load failures; assess readiness, capture approved journeys and run staged replay only within explicitly approved limits. Static hypotheses are not measured capacity.

- **Lenses:** Performance
- **Evidence to collect:** source, server config, deployment config, schema, har, network log, screenshots, scenario plan, approval record, stage metrics, system metrics
- **Also called:** load-testing, load-test, traffic-replay
- **Safety:** No target traffic before capture confirmation and no load before separate explicit plan-specific user approval. Enforce approved origin/routes, VUs, RPS, requests, time and stop thresholds. No third-party, production-impacting, paid, destructive or notification traffic without specific authorization. Never bypass throttling or auto-restart after abort.
- **Check families:**
  - deep read-only code path and effective versus checked-in configuration review
  - source-backed bottleneck hypotheses counterevidence and conditional resource budgets
  - target ownership environment dependencies readiness and observation
  - separate capture and load-generation confirmation
  - sensitive traffic sanitation and replay eligibility
  - correlated virtual-user identities sessions and synthetic data
  - bounded smoke ramp pacing concurrency and request ceilings
  - business assertions latency throughput errors and saturation
  - abort recovery cleanup and non-destructive boundaries
  - measured stage comparisons generator limitations and reproducible retests

<a id="stress"></a>
## Stress Readiness and Recovery

Review source/server configuration read-only and test explicit stress hypotheses using bounded isolated local loops or separately approved external scenarios, measuring correctness and recovery as well as pressure.

- **Lenses:** Performance, OWASP
- **Evidence to collect:** source, server config, deployment config, dependency map, local harness, approval record, stage metrics, recovery evidence
- **Also called:** stress-testing, stress-test, stress-readiness
- **Safety:** Assessment never executes app code or changes original source/server settings. Local execution needs explicit bounded approval and enforced isolation. Anything other than verified isolated localhost requires two separate sequential user confirmations. No unbounded loops, host exhaustion, detached generators, protection bypass or automatic restart after abort.
- **Check families:**
  - deep read-only capacity and configuration hypotheses
  - verified localhost isolation and remote dependency classification
  - two distinct sequential confirmations for any non-local stress
  - bounded tight-loop parsing cache cleanup queue contention and cancellation probes
  - independent iteration concurrency input and resource dimensions
  - supervision resource ceilings abort and no-egress local isolation
  - correctness invariants post-pressure recovery and retained state
  - source versus measured evidence and bounded-capacity conclusions

<a id="performance"></a>
## Performance

Measure user-visible speed and system behavior under realistic data, device, network, concurrency, and duration conditions.

- **Lenses:** Performance
- **Evidence to collect:** performance trace, network, screenshots, resource timing, api timing, system metrics, source
- **Also called:** perf, speed, web-vitals
- **Check families:**
  - startup and page-load milestones
  - Core Web Vitals and interaction latency
  - request payload bundle image and font cost
  - cache CDN compression and reuse
  - API database and downstream timing
  - mobile CPU memory battery and network constraints
  - concurrency throughput queueing and backpressure
  - long-run memory leaks degradation and recovery

<a id="networking"></a>
## Networking

Verify protocol, request, response, caching, connectivity, timeout, retry, offline, proxy, and dependency behavior.

- **Lenses:** Performance, Security, OWASP
- **Evidence to collect:** network log, headers, cookies, dns tls metadata, performance timing, console, server log
- **Also called:** network, connectivity, http, transport
- **Check families:**
  - DNS TLS HTTP and redirect correctness
  - request methods headers bodies and content types
  - status codes errors and contract consistency
  - cache compression CDN and conditional requests
  - timeouts retries backoff cancellation and idempotency
  - offline reconnect packet loss and slow-network behavior
  - CORS proxies gateways firewalls and third parties
  - sensitive data in URLs headers logs and telemetry

<a id="state"></a>
## State Integrity and Round Trips

Find inconsistent, lost, stale or invalid state through source inspection and bounded multi-step, multi-tab, independent-user/API and export/reimport scenarios, including invalid-load and recovery behavior.

- **Lenses:** OWASP, Security, Performance
- **Evidence to collect:** source, schema, state model, actor timeline, storage snapshot, export file, network log, screenshots, recovery evidence
- **Also called:** state-testing, state-integrity, state-consistency, round-trip
- **Safety:** Source assessment is read-only. Use isolated copies and synthetic records for corruption, imports, deletion, interruption or migration. Never overwrite original exports or clear real browser/database state. Gate consequential/shared mutations; bounded actors are not load/stress authorization.
- **Check families:**
  - authoritative state ownership invariants transitions and persistence boundaries
  - multi-tab shared-session and independent-user API interleavings
  - stale responses conflicts lost updates retries and idempotency
  - save reload reopen offline reconciliation and account switching
  - export reimport semantic round trips and snapshot consistency
  - invalid persisted data schemas migrations startup and recovery
  - isolated corruption tests source hypotheses versus demonstrated failures
  - minimal event-sequence reproduction and state-difference evidence

<a id="reliability"></a>
## Reliability and Resilience

Challenge continuity, consistency, recovery, observability, and truthfulness under dependency failures, restarts, races, and repeated use.

- **Lenses:** Performance, Error UX, AI-generated code
- **Evidence to collect:** live ui, api, logs, traces, network, data state, restart and recovery evidence
- **Also called:** resilience, stability, recovery
- **Check families:**
  - dependency failure and graceful degradation
  - retry idempotency deduplication and replay
  - restart crash and partial-write recovery
  - race ordering consistency and stale state
  - timeouts cancellation circuit breakers and backpressure
  - observability alertability and truthful health
  - long-duration and repeated-operation stability
  - backup restore rollback and disaster recovery

<a id="compatibility"></a>
## Compatibility

Verify important behavior across supported browsers, engines, devices, viewports, input modes, operating systems, and integration versions.

- **Lenses:** Usability, Accessibility, Performance
- **Evidence to collect:** screenshots, live ui, browser matrix, console, network, accessibility tree
- **Also called:** cross-browser, browser-compatibility, device
- **Check families:**
  - supported browser and engine matrix
  - desktop mobile tablet and responsive states
  - mouse keyboard touch pen and assistive input
  - operating-system rendering and conventions
  - feature detection fallbacks and polyfills
  - storage cookies permissions and private modes
  - API dependency and schema-version compatibility
  - upgrade downgrade and backward compatibility

<a id="content"></a>
## Content

Check content truth, clarity, structure, completeness, consistency, credibility, navigation, errors, media, and responsive readability.

- **Lenses:** Content, News & content, Legal policy
- **Evidence to collect:** page text, screenshots, dom, metadata, links, source
- **Also called:** copy, writing, seo, information-architecture
- **Check families:**
  - page identity and information hierarchy
  - clarity grammar terminology and reading level
  - claims evidence dates prices and policy truth
  - missing stale duplicate placeholder and debug content
  - links navigation labels and calls to action
  - images media captions alternatives and metadata
  - error empty loading and completion messages
  - responsive localization and accessibility readability

<a id="data"></a>
## Data Integrity

Trace input, validation, transformation, persistence, synchronization, migration, export, deletion, and authorization of important data.

- **Lenses:** Forms, Privacy, AI-generated code
- **Evidence to collect:** source, api, database schema, data state, logs, exports, migration artifacts
- **Also called:** data-integrity, database, persistence
- **Check families:**
  - schema constraints defaults and nullability
  - validation normalization encoding and precision
  - create read update delete and lifecycle truth
  - transactions partial writes races and idempotency
  - migration backward compatibility and rollback
  - sync import export round-trip and deduplication
  - authorization privacy retention and erasure
  - audit lineage reconciliation and corruption detection

<a id="api"></a>
## API

Exercise API contracts, auth, inputs, outputs, errors, versions, state, concurrency, security, performance, and consumers.

- **Lenses:** Security, Performance, AI-generated code
- **Evidence to collect:** openapi or schema, source, requests, responses, logs, traces, consumer code, data state
- **Also called:** rest, graphql, rpc, webhook
- **Check families:**
  - method route schema and content-type contracts
  - authentication authorization scopes and tenancy
  - valid invalid missing extra duplicate and extreme inputs
  - status errors pagination filtering sorting and rate limits
  - idempotency concurrency ordering retries and webhooks
  - versioning deprecation backward and consumer compatibility
  - injection leakage CORS SSRF and resource bounds
  - latency caching observability and downstream failure

<a id="intl"></a>
## Internationalization Readiness and Completion

Assess engineering readiness and evidence-qualified completion against the app's intended locales, markets, requirements and critical journeys, separately from linguistic translation review.

- **Lenses:** Content, Usability, Accessibility, Pricing
- **Evidence to collect:** source, locale files, requirements, runtime config, live ui, screenshots, api, data state, tests, build artifacts
- **Also called:** internationalization, i18n, internationalisation, intl-readiness
- **Check families:**
  - declared implemented and verified locale support
  - string externalization extraction catalog parsing and message architecture
  - locale negotiation persistence fallback loading and recovery
  - dates numbers currencies Unicode input storage search and round trips
  - RTL mixed direction fonts expansion and accessible responsive rendering
  - localized API cache background jobs documents and exports
  - locale packaging CI regression and translation lifecycle
  - requirements by locale completion matrix blockers evidence freshness and release authority

<a id="localization"></a>
## Localization and Internationalization

Find internationalization blockers and contextually incorrect translations by connecting source strings and locale catalogs to actual screen states, actions, terminology, and user consequences.

- **Lenses:** Content, Usability, Accessibility, Pricing
- **Evidence to collect:** live ui, screenshots, page text, source, locale files, api, data state
- **Also called:** l10n, translation
- **Check families:**
  - source and target locale inventory glossary and contextual call-site mapping
  - language selection detection persistence and fallback
  - catalog completeness duplicate keys native format parsing placeholders and plural branches
  - contextual translation meaning negation action actor tense terminology and locale variant
  - payment deletion consent error and recovery semantic consequences
  - hardcoded strings concatenation and untranslated secondary channels
  - text expansion truncation wrapping and responsive layout
  - right-to-left direction and bidirectional text
  - Unicode normalization graphemes emoji and input methods
  - date time number currency address name and plural formats
  - sorting search case accents collation and segmentation
  - locale-specific accessibility legal and cultural expectations
  - side-by-side translation evidence suggested wording and native-review boundaries
