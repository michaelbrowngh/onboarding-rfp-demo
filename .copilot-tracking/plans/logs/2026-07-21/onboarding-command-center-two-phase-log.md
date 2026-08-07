<!-- markdownlint-disable-file -->
# Planning Log: Onboarding Command Center Two-Phase Delivery

## Discrepancy Log

Gaps and differences identified between research findings and the implementation plan.

### Unaddressed Research Items

* None. Previously logged DR-01 and DR-02 are resolved in updated planning artifacts.

### Plan Deviations from Research

* DD-01: Validation stack excludes immediate test runner setup in Phase 1
  * Research recommends: Add Vitest + Testing Library for utility and render tests
  * Plan implements: Lint/build/manual deterministic checks first; optional tests can be added in follow-on planning
  * Rationale: Two-phase scope prioritizes screenshot-first P0 delivery and optional deterministic P1 interactions, while keeping dependency expansion intentionally minimal in initial execution

## Implementation Paths Considered

### Selected: Minimal custom component composition with local deterministic data

* Approach: Introduce small presentational components, local TypeScript domain/data modules, deterministic prompt/response utilities, and CSS Modules for controlled UI state
* Rationale: Meets P0 screenshot acceptance and optional P1 interactivity with smallest practical change set and minimal dependencies
* Evidence: .copilot-tracking/research/2026-07-21/onboarding-command-center-p0-simplest-react-vite-research.md (Lines 138-182)

### IP-01: Fluent UI-heavy composition

* Approach: Build screen with Fluent UI controls and theming primitives
* Trade-offs: Faster control polish but additional dependency/theme overhead and complexity beyond P0 scope
* Rejection rationale: Conflicts with smallest-scope prototype requirement and strict exclusion of unnecessary production concerns

### IP-02: Monolithic App.tsx implementation

* Approach: Keep all screen logic in one file with minimal extraction
* Trade-offs: Quick initial implementation but poorer maintainability and higher refactor risk for optional P1
* Rejection rationale: Weak separation of concerns for deterministic prompt/response and candidate-section behavior

## Suggested Follow-On Work

* WI-01: Add deterministic unit and render test suite — Introduce Vitest + RTL tests for risk grouping, KPI computation, and prompt output (Medium)
  * Source: Research testing recommendations
  * Dependency: Phase 1 completion

* WI-02: Add lightweight visual regression script — Capture and compare fixed viewport screenshots for demo regression checks (Low)
  * Source: Research potential next research item
  * Dependency: Phase 1 completion

* WI-03: Expand local-only interaction audit trail — Record local action history for stakeholder demos without backend (Low)
  * Source: P1 optional local state change requirement
  * Dependency: Phase 2 completion

## Approval Records

* AR-01 (Phase 1): Screenshot artifact captured at .copilot-tracking/artifacts/2026-07-21/p0-command-center-1440x900.png; implementation paused pending human review and approval note
* AR-02 (Phase 2): Pending implementation capture of .copilot-tracking/artifacts/2026-07-21/p1-clickflow-validation-notes.md and reviewer approval note
