<!-- markdownlint-disable-file -->
# Task Research: Simplest React TypeScript Vite P0 Command Center

Research for the simplest implementation approach for a screenshot-first P0 desktop screen for the New Hire Onboarding Operations Command Center.

## Task Implementation Requests

* Research the simplest React + TypeScript + Vite implementation for P0 screenshot scope
* Survey repository and recommend component boundaries
* Recommend local data structures and risk-rule configuration
* Recommend prompt-building approach for sidecar context
* Recommend accessibility treatment, testing approach, styling approach, and minimal dependencies
* Exclude backend, auth, database, real AI model, routing, and external integrations

## Scope and Success Criteria

* Scope: P0 screenshot-first architecture and implementation guidance only for existing repository
* Assumptions:
  * Existing app is Vite + React + TypeScript and can be refactored incrementally
  * P0 requires deterministic synthetic data and one 1440x900 screenshot-ready state
  * P1 interaction notes may be included only as forward-compatible constraints
* Success Criteria:
  * Repository findings are evidence-backed with file paths and line numbers
  * At least two viable implementation alternatives are evaluated
  * One selected approach is recommended with rationale and risks
  * Guidance is actionable for Task Planner and Task Implementor handoff

## Outline

1. Repository baseline and constraints
2. Recommended component boundaries
3. Domain and local data structure recommendations
4. Risk-rule configuration model
5. Assistant prompt-builder model
6. Accessibility treatment
7. Testing approach
8. Styling approach and dependency choices
9. Alternatives and selected approach
10. Implementation-ready handoff

## Potential Next Research

* Evaluate lightweight visual regression options for P1 demo quality
  * Reasoning: P0 is screenshot-first, but P1 may benefit from deterministic visual checks
  * Reference: .copilot-tracking/research/subagents/2026-07-21/external-guidance-research.md
* Confirm whether fixed timezone should be UTC or business-local for displayed timestamps
  * Reasoning: affects screenshot repeatability and stakeholder interpretation
  * Reference: docs/requirements/build-specification.md

## Research Executed

### File Analysis

* new-hire-onboarding-command-center/package.json
  * Baseline scripts are dev/build/lint/preview only; no test script
* new-hire-onboarding-command-center/src/App.tsx
  * Current UI is starter content and does not implement command-center requirements
* new-hire-onboarding-command-center/src/index.css
  * Global style foundation includes dark-mode behavior and non-spec visual tokens
* new-hire-onboarding-command-center/docs/requirements/build-specification.md
  * Source-of-truth constraints and P0 acceptance criteria

### Code Search Results

* Search: test files/config in app workspace
  * No existing test files or test runner config discovered
* Search: command-center-specific components
  * No existing KPI, candidate section, or assistant sidecar components discovered

### External Research

* Vite documentation
  * Vite supports React + TypeScript with minimal config, native CSS Modules, and separate type-check workflow
  * Source: <https://vite.dev/guide/>
* Vitest and Testing Library documentation
  * Minimal Vite-native test stack is Vitest + RTL + jest-dom + jsdom
  * Sources:
    * <https://vitest.dev/guide/>
    * <https://testing-library.com/docs/react-testing-library/intro/>
* WCAG and ARIA guidance
  * Emphasize semantic structure, keyboard access, visible focus, contrast, and non-color-only status
  * Sources:
    * <https://www.w3.org/WAI/WCAG22/quickref/>
    * <https://www.w3.org/WAI/ARIA/apg/patterns/>

### Project Conventions

* Standards referenced: docs/requirements/build-specification.md
* Instructions followed: Task Researcher mode instructions

## Key Discoveries

### Project Structure

* The app is currently a default Vite React scaffold, not a command-center prototype
* No existing domain/data/utils/component partitioning for onboarding operations concepts
* Build stack already matches required technology constraints

### Implementation Patterns

* Current rendering pattern is monolithic in App.tsx with starter UI sections
* Styling is currently global CSS and token variables with dark-mode preferences
* Baseline dependency footprint is very small, which favors minimal-addition architecture

### Complete Examples

```ts
// Recommended P0 composition boundary (shape only)
type QueueCategory = 'critical' | 'action-required' | 'warning' | 'on-track'

interface CommandCenterViewModel {
  kpis: KpiSnapshot[]
  aiSummary: string
  candidatesByQueue: Record<QueueCategory, CandidateCase[]>
  lastRefreshLabel: string
}

function CommandCenterPage({ model }: { model: CommandCenterViewModel }) {
  // Render-only composition for screenshot-first P0
  return null
}
```

### API and Schema Documentation

* Target domain model and utility boundaries are defined in build specification section 15 and section 11
* Recommended file layout in build specification section 16 is valid and can be reduced slightly for P0 simplicity

### Configuration Examples

```ts
// src/utils/riskRulesConfig.ts
export interface RiskThresholdConfig {
  criticalSlaRemainingPercent: number
  warningSlaRemainingPercent: number
  actionRequiredSlaRemainingPercent: number
  criticalStartDateDays: number
  staleTicketHours: number
  highCommsCount7Days: number
}

// Prototype assumptions only. SME validation required before production.
export const defaultRiskThresholds: RiskThresholdConfig = {
  criticalSlaRemainingPercent: 20,
  warningSlaRemainingPercent: 50,
  actionRequiredSlaRemainingPercent: 30,
  criticalStartDateDays: 2,
  staleTicketHours: 48,
  highCommsCount7Days: 6,
}
```

## Technical Scenarios

### Minimal custom component composition with scoped CSS and local TypeScript data

**Requirements:**

* Meet all P0 visual and data contracts with deterministic synthetic data
* Keep dependency growth minimal
* Preserve testability for risk rules, grouping, KPI calculations, and prompt generation

**Preferred Approach:**

* Use small presentational components and pure utility modules
* Use CSS Modules for component scoping plus a small global token file
* Keep all data local in TypeScript files with one deterministic demo date source

```text
new-hire-onboarding-command-center/src/
  app/
    CommandCenterPage.tsx
  components/
    HeaderBar.tsx
    KpiBand.tsx
    AiKpiSummary.tsx
    CandidateSection.tsx
    CandidateRow.tsx
    AssistantSidecar.tsx
  data/
    demoDate.ts
    slaDefinitions.ts
    kpiSnapshots.ts
    candidateCases.ts
  domain/
    onboarding.ts
  utils/
    riskRulesConfig.ts
    riskRules.ts
    promptBuilder.ts
  styles/
    tokens.css
```

**Implementation Details:**

* Section and row rendering stays declarative and deterministic
* Risk classification is pure and independently testable
* Prompt builder outputs sidecar-ready text from candidate context without model calls

#### Considered Alternatives

* Fluent UI-heavy composition: rejected for P0 due to dependency/theme overhead relative to screenshot-only goal
* Monolithic single-screen implementation: rejected due to weak maintainability and high P1 refactor risk

### Fluent UI-heavy composition with minimal custom primitives

**Requirements:**

* Accelerate polished controls and baseline accessibility semantics

**Preferred Approach:**

* Use Fluent components for layout and controls, retain custom domain utilities

**Implementation Details:**

* Faster control-level consistency if team is Fluent-proficient
* Adds runtime dependency weight and theming setup not required for P0 acceptance

#### Considered Alternatives

* Not selected for P0 simplicity target

### Monolithic single-screen App.tsx with minimal extraction

**Requirements:**

* Fastest path to first screenshot with minimal file ceremony

**Preferred Approach:**

* Keep page in one component; extract only unavoidable utilities

**Implementation Details:**

* Fastest initial output, but degraded readability and larger P1 refactor surface
* Higher risk of accessibility/section-structure regressions in dense UI

#### Considered Alternatives

* Not selected due to medium-term cost and fragility

## Selected Approach

Select minimal custom component composition with scoped CSS and local TypeScript data.

### Rationale

* Best fit with explicit small-dependency constraint in build specification
* Meets P0 screenshot contract without introducing unnecessary framework overhead
* Preserves clean utility boundaries for required P0 tests
* Provides a stable base for optional P1 deterministic sidecar interactions

## Repository Evidence Log

### Baseline Application State

* new-hire-onboarding-command-center/src/App.tsx:8
* new-hire-onboarding-command-center/src/App.tsx:19
* new-hire-onboarding-command-center/src/App.tsx:35

### Dependency and Script Baseline

* new-hire-onboarding-command-center/package.json:7
* new-hire-onboarding-command-center/package.json:8
* new-hire-onboarding-command-center/package.json:13
* new-hire-onboarding-command-center/package.json:16

### Styling Baseline

* new-hire-onboarding-command-center/src/index.css:20
* new-hire-onboarding-command-center/src/index.css:33

### P0 Requirement Anchors

* new-hire-onboarding-command-center/docs/requirements/build-specification.md:41
* new-hire-onboarding-command-center/docs/requirements/build-specification.md:46
* new-hire-onboarding-command-center/docs/requirements/build-specification.md:50
* new-hire-onboarding-command-center/docs/requirements/build-specification.md:136
* new-hire-onboarding-command-center/docs/requirements/build-specification.md:536
* new-hire-onboarding-command-center/docs/requirements/build-specification.md:562

## Recommended Component Boundaries

* src/app/CommandCenterPage.tsx
  * Layout orchestration only: header, KPI block, queue sections, assistant shell
* src/components/HeaderBar.tsx
  * Title, synthetic-data label, last refresh, Refresh button
* src/components/KpiBand.tsx
  * Four to six KPI cards and aggregate risk counters
* src/components/AiKpiSummary.tsx
  * Deterministic summary text derived from mock data
* src/components/CandidateSection.tsx
  * Reusable section shell for Critical, Action Required, Warning / Flags
* src/components/CandidateRow.tsx
  * Candidate-step-status-description-next-step-action contract
* src/components/AssistantSidecar.tsx
  * Docked right shell with deterministic context display

## Recommended Local Data Structures

* src/domain/onboarding.ts
  * CandidateCase, KpiSnapshot, SlaDefinition, SlaState, AssistantContext, QueueCategory, ActionMode
* src/data/demoDate.ts
  * Fixed ISO demo timestamp exported as constant
* src/data/slaDefinitions.ts
  * KPI/SLA metadata for P0 card labels and targets
* src/data/candidateCases.ts
  * At least seven records meeting queue distribution acceptance criteria
* src/data/kpiSnapshots.ts
  * Four to six KPI snapshots with consistent near-SLA/projected-miss counts

## Risk-Rule Configuration Model

* src/utils/riskRulesConfig.ts
  * Threshold constants and assumptions
* src/utils/riskRules.ts
  * Pure functions:
    * classifyQueue
    * groupByQueue
    * computeNearSlaAndProjectedMiss
* Keep thresholds configurable and explicitly commented as prototype assumptions requiring SME validation

## Prompt-Building Approach

* src/utils/promptBuilder.ts
  * One deterministic function that builds sidecar prompt text from candidate context
* Include in prompt payload:
  * candidate ID/name
  * process step and phase
  * start date
  * blocker
  * SLA name/due/elapsed percent
  * recent activity summary
  * recommended action and requested assistant task
* Output plain text only; no real model invocation

## Accessibility Treatment

* Use semantic landmarks: header/main/section/aside
* Use explicit heading hierarchy for three priority sections
* Ensure all row action buttons are keyboard reachable
* Preserve visible focus styles and sufficient contrast
* Use non-color status indicators: text labels plus icons
* Provide assistant shell accessible name and refresh status live region

## Testing Approach

* Minimum stack recommendation:
  * vitest
  * @testing-library/react
  * @testing-library/jest-dom
  * jsdom
* P0-aligned tests:
  * risk classification utility
  * candidate grouping
  * KPI near-SLA/projected-miss computations
  * prompt-builder output for known case
  * render assertions for required sections and labels
* Deterministic time:
  * use fixed demo-date constants and vi.setSystemTime where needed

## Styling Approach

* Use CSS Modules for component-scoped styling
* Keep shared design tokens in src/styles/tokens.css
* Remove dependence on current starter-theme assumptions
* Do not add charting dependency for P0 unless KPI readability is materially better

## Minimal Dependencies Recommendation

* Runtime dependencies for P0:
  * Keep current React and React DOM only
* Dev dependencies for test enablement:
  * vitest
  * @testing-library/react
  * @testing-library/jest-dom
  * jsdom
* Optional/deferred:
  * Fluent UI packages only if a concrete gap emerges during planning

## Implementation-Ready Handoff Notes

* Keep Phase 1 strictly to P0 screenshot scope
* Ensure queue distribution satisfies acceptance criteria
* Keep assistant shell visible but simulated
* Avoid backend/auth/database/routing/real AI/external integration additions
* Validate using build plus selected P0 tests before phase stop
