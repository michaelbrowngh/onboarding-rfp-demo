---
title: Implementation Alternatives Research for Screenshot-First P0 UI
description: Evaluation of three implementation approaches for a React TypeScript Vite P0 command-center UI with recommendation for simplest path.
author: GitHub Copilot
ms.date: 2026-07-21
ms.topic: overview
keywords:
  - react
  - typescript
  - vite
  - p0
  - architecture
  - alternatives
estimated_reading_time: 8
---

## Research Scope

* Evaluate three implementation alternatives for P0 in this repository context:
  * Alternative A: Custom lightweight components + CSS modules/scoped CSS + local TS mock data.
  * Alternative B: Fluent UI-heavy composition + minimal custom primitives.
  * Alternative C: Single-screen monolithic implementation with minimal extraction.
* Cover architecture boundaries, data layout, risk-rule utility/config, prompt-builder pattern, accessibility, testing, dependency impact, and complexity tradeoffs.
* Recommend one preferred P0 approach and explain why others are not selected.

## Repository Evidence and Constraints

* P0 is explicitly a screenshot-first milestone with one polished desktop screen: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:41`.
* Required visible zones include KPI band, AI summary, three stacked candidate sections, refresh action, and right docked assistant: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:46`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:47`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:48`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:50`.
* Tech and scope constraints require React + TypeScript + Vite and local mock data, with no backend/database: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:82`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:85`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:86`.
* The specification prefers Fluent UI only when helpful and still emphasizes small dependencies: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:84`.
* Styling guidance allows CSS modules, scoped CSS, or similarly maintainable scoped styles: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:88`.
* Deterministic date behavior is required for business logic: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:87`.
* P0 test expectations include risk classification utility, grouping, KPI calculations, prompt-builder, and required-section rendering: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:562`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:564`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:567`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:568`.
* Current codebase is still default starter UI, so the P0 screen is a full replacement of current app composition:
  * Placeholder counter/content in app shell: `new-hire-onboarding-command-center/src/App.tsx:8`, `new-hire-onboarding-command-center/src/App.tsx:19`, `new-hire-onboarding-command-center/src/App.tsx:29`.
  * Global style system includes `color-scheme: light dark`, which conflicts with spec visual direction unless intentionally overridden: `new-hire-onboarding-command-center/src/index.css:20`, `new-hire-onboarding-command-center/src/index.css:33`.
* Dependency baseline is minimal (React and React DOM only at runtime), so added libraries are easy to quantify:
  * Runtime deps: `new-hire-onboarding-command-center/package.json:12`, `new-hire-onboarding-command-center/package.json:13`, `new-hire-onboarding-command-center/package.json:14`.
  * Build and lint scripts already available: `new-hire-onboarding-command-center/package.json:8`, `new-hire-onboarding-command-center/package.json:9`.

## Alternative A

### Architecture and component boundaries

* Use a small compositional tree with focused components:
  * `src/app/CommandCenterPage.tsx` as top-level page layout.
  * `src/components/HeaderBar.tsx`.
  * `src/components/KpiBand.tsx`.
  * `src/components/AiSummary.tsx`.
  * `src/components/CandidateSection.tsx`.
  * `src/components/CandidateRow.tsx`.
  * `src/components/AssistantSidecar.tsx`.
* Keep state near page root for P0, with pure render props down the tree.
* Avoid context/store for P0.

### Data structure layout and file locations

* Place domain types in `src/domain/onboarding.ts`.
* Place deterministic mock data in `src/data/`:
  * `demoDate.ts`.
  * `candidateCases.ts`.
  * `kpiSnapshots.ts`.
  * `slaDefinitions.ts`.
* Create section selectors in `src/data/selectors.ts` for grouping and counts.

### Risk-rule utility/config pattern

* `src/utils/riskRulesConfig.ts` for thresholds and assumptions.
* `src/utils/riskRules.ts` for pure classifier functions.
* Expose one top-level function:
  * `classifyCandidateQueue(caseItem, config, demoDate)`.
* Keep prototype assumptions in comments inside config only.

### Prompt-builder utility pattern

* `src/utils/promptBuilder.ts` with single deterministic builder:
  * `buildAssistantPrompt(caseItem, slaDefinition, recentActivity, demoDate)`.
* Use small string templates and explicit fallback fields.
* Return both display prompt and metadata object for future P1 states.

### Accessibility implications

* Strong fit for semantic markup because custom components can encode section heading levels and row action labels directly.
* Easy to enforce visible focus and status text beyond color.
* Requires deliberate keyboard handling but remains straightforward.

### Testing implications

* Excellent unit testability because grouping, risk rules, KPI calculations, and prompt builder are isolated pure functions.
* Component tests can target section rendering and required fields with low mocking overhead.
* Requires adding a test harness, but the architecture naturally supports spec test items.

### Dependency impact

* Runtime dependencies can remain unchanged for P0.
* Dev dependencies likely add only test tooling in P0/P1 phases.
* Lowest package-weight growth.

### Complexity and maintainability tradeoffs

* Moderate initial setup cost because files are intentionally split.
* Best long-term maintainability and easiest phased extension to P1.
* Low coupling and clear ownership of risk logic versus view logic.

## Alternative B

### Architecture and component boundaries

* Build most UI using Fluent UI building blocks with minimal wrappers:
  * Page composed from Fluent layout/typography surfaces.
  * Thin wrappers only for domain-specific row content and assistant context labels.
* Keep a single page container and smaller Fluent-driven subviews.

### Data structure layout and file locations

* Same data/domain layout as Alternative A is still advised.
* Component files can be fewer because Fluent primitives absorb style responsibilities.

### Risk-rule utility/config pattern

* Same as Alternative A for correctness and testability.
* Risk logic remains framework-agnostic and should not live in Fluent components.

### Prompt-builder utility pattern

* Same as Alternative A.
* Sidecar action chips and buttons map to generated prompt tasks.

### Accessibility implications

* Fluent controls generally improve baseline accessibility behavior.
* Still requires custom labels and status text for domain fields.
* Accessibility behavior can be strong quickly if the Fluent patterns are applied correctly.

### Testing implications

* Utility tests remain strong.
* UI tests may become more selector-fragile if structure is deeply wrapped by Fluent components.
* Snapshot and role-based queries can still work, but markup abstraction may slow debugging.

### Dependency impact

* Significant runtime dependency increase from adding Fluent UI packages.
* Potential style-system and theming setup overhead.
* Higher chance of version and bundle-size churn relative to A and C.

### Complexity and maintainability tradeoffs

* Faster to get polished controls if team already uses Fluent patterns.
* Higher dependency and theming complexity for a screenshot-first P0.
* Maintainability depends on Fluent familiarity; otherwise indirection increases learning curve.

## Alternative C

### Architecture and component boundaries

* Implement almost everything in one screen file, e.g. `src/App.tsx`.
* Keep only tiny extracted helpers for classification and prompt generation to satisfy testability.
* Minimal or no reusable UI component boundaries in P0.

### Data structure layout and file locations

* Option 1: Inline mock arrays in `src/App.tsx`.
* Option 2: One local `src/p0Data.ts` imported into `App.tsx`.
* Utility files for `riskRules.ts` and `promptBuilder.ts` are still recommended to keep core logic testable.

### Risk-rule utility/config pattern

* Must still use external utility/config files to avoid logic entanglement and meet P0 test coverage expectations.
* If left inline, testing and future edits degrade quickly.

### Prompt-builder utility pattern

* Keep prompt builder external for deterministic outputs.
* Page code calls utility and renders generated text directly into sidecar shell.

### Accessibility implications

* Highest risk of semantic drift because one large file often mixes heading levels and interaction labels.
* Focus order and keyboard affordances are easier to miss during rapid single-file assembly.

### Testing implications

* Logic tests remain possible if utilities are externalized.
* UI rendering tests become broader and less precise because of monolithic structure.
* Refactors for P1 likely force test rewrites.

### Dependency impact

* No additional runtime dependencies needed for P0.
* Similar package impact to Alternative A.

### Complexity and maintainability tradeoffs

* Lowest initial coding ceremony and potentially fastest first screenshot.
* Highest medium-term maintenance cost and highest refactor pressure moving to P1.
* Risk of accidental regressions due to large component scope.

## Comparative Summary

| Dimension | Alternative A | Alternative B | Alternative C |
|---|---|---|---|
| P0 delivery speed | High | Medium | Very high |
| Dependency growth | Very low | High | Very low |
| Accessibility control | High | Medium-high | Medium-low |
| Utility testability | High | High | Medium |
| P1 readiness | High | Medium-high | Low-medium |
| Team cognitive load | Medium | Medium-high | Low initially, high later |
| Long-term maintainability | High | Medium | Low |

## Preferred Approach for P0

Select Alternative A for P0 simplicity with controlled extensibility.

### Why Alternative A is preferred

* It best matches the explicit requirement to keep dependencies small while allowing scoped maintainable CSS and deterministic local data.
* It meets P0 visual scope without introducing a heavy design-system dependency that is not required for screenshot delivery.
* It directly supports the specified P0 test targets by isolating risk rules, grouping, KPI counts, and prompt builder.
* It avoids monolithic technical debt while still remaining lightweight enough for a fast screenshot-first phase.

### Why Alternative B is not selected for P0

* It conflicts with the practical interpretation of dependency minimization for a prototype where most UI can be achieved with custom lightweight components.
* It introduces avoidable setup and theming overhead before P1 interaction needs justify it.
* It increases bundle and version surface area without clear P0 requirement coverage gains.

### Why Alternative C is not selected for P0

* It is fast initially but undermines maintainability and P1 transition.
* It increases risk of accessibility and section-structure regressions in a dense command-center layout.
* It does not align well with expected utility-level test coverage unless partially restructured, which reduces its speed advantage.

## Recommended P0 Implementation Shape from the Preferred Approach

* File layout:
  * `src/app/CommandCenterPage.tsx`
  * `src/components/HeaderBar.tsx`
  * `src/components/KpiBand.tsx`
  * `src/components/AiSummary.tsx`
  * `src/components/CandidateSection.tsx`
  * `src/components/CandidateRow.tsx`
  * `src/components/AssistantSidecar.tsx`
  * `src/data/demoDate.ts`
  * `src/data/candidateCases.ts`
  * `src/data/kpiSnapshots.ts`
  * `src/domain/onboarding.ts`
  * `src/utils/riskRulesConfig.ts`
  * `src/utils/riskRules.ts`
  * `src/utils/promptBuilder.ts`
  * `src/styles/tokens.css`
* Keep `src/App.tsx` as a thin composition entry.
* Keep deterministic demo date in one place and pass into derived calculations.
* Keep all integration behavior simulated and local for P0.

## Unresolved Questions

* Should P0 include exactly six synthetic cases from the required scenario table, or should additional filler rows be included for visual density at 1440 x 900?
* Should P0 accessibility validation be limited to semantic/keyboard inspection, or should automated checks be required in this phase?
* Is there a hard preference to avoid adding test dependencies in the same PR as visual P0 implementation, or can minimum test tooling be introduced with P0?

## Research Status

* Status: Complete for the requested alternatives evaluation scope.
* Confidence: High for architecture and tradeoff recommendation; medium for exact test-tooling choice until planning phase finalizes tooling strategy.
