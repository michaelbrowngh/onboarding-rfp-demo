---
title: External Guidance Research for Minimal React TS Vite Prototype
description: Practical external guidance and project-specific recommendations for screenshot-first, accessible, testable React TypeScript Vite prototype delivery with minimal dependencies
author: GitHub Copilot
ms.date: 2026-07-21
ms.topic: reference
keywords:
  - react
  - vite
  - typescript
  - accessibility
  - testing
  - vitest
  - testing-library
  - prototype
estimated_reading_time: 10
---

## Research Scope

This research addresses the following requested topics for this repository:

* Vite + React + TypeScript baseline best practices for small prototypes
* Minimal testing stack recommendation and rationale
* Accessibility essentials for dashboard-like interfaces
* Styling approach tradeoffs for minimal dependency prototypes
* Deterministic date handling guidance for prototypes

Out of scope constraints respected:

* No backend, auth, database, routing, or real AI integration
* Keep dependencies minimal
* Prototype-first and screenshot-first workflow

## Project Context Confirmed

Local requirement and implementation constraints from
new-hire-onboarding-command-center/docs/requirements/build-specification.md:

* Use synthetic data only and keep a prototype boundary
* Build P0 as one polished 1440 x 900 desktop screenshot state first
* React + TypeScript + Vite stack
* Keep dependencies small; Fluent UI is optional/preferred only where useful
* No required backend or database
* Use CSS modules, scoped CSS, or another simple maintainable styling approach

Current implementation baseline from new-hire-onboarding-command-center/package.json:

* Runtime deps: react, react-dom
* Dev deps: vite, @vitejs/plugin-react, typescript, oxlint, @types/*
* No test stack currently installed

## External Findings

### 1) Vite + React + TS Baseline for Small Prototypes

What authoritative docs emphasize:

* Vite ships sensible defaults for fast local iteration and production build output.
* Vite supports React templates directly (react-ts) and first-party React plugin integration.
* Vite transpiles TypeScript but does not type-check by itself; type-check should run separately.
* Vite supports CSS and CSS Modules natively out of the box.

Why this matters here:

* For screenshot-first prototypes, startup speed and low config are valuable.
* The current stack already matches Vite guidance and can stay minimal.
* Add explicit type-check script to separate correctness from bundling speed.

Sources:

* <https://vite.dev/guide/>
* <https://vite.dev/guide/features.html>

### 2) Minimal Testing Stack Recommendation

What authoritative docs emphasize:

* Vitest is Vite-native and reuses Vite config by default.
* React Testing Library is lightweight and focused on user-centered behavior rather than implementation details.
* Testing Library recommends semantic queries by priority, with getByRole first.
* jest-dom provides ergonomic DOM assertions as a companion matcher library.
* jsdom or happy-dom are available environments in Vitest for browser-like tests.

Practical minimal stack for this project:

* vitest
* @testing-library/react
* @testing-library/jest-dom
* jsdom

Optional only if needed later:

* @testing-library/user-event for richer interaction sequences

Why this is minimal and practical:

* Uses one test runner aligned with Vite.
* Keeps test philosophy close to accessibility and real usage.
* Avoids heavier e2e tools for P0 screenshot-focused phase.

Sources:

* <https://vitest.dev/guide/>
* <https://vitest.dev/guide/environment>
* <https://testing-library.com/docs/react-testing-library/intro/>
* <https://testing-library.com/docs/guiding-principles>
* <https://testing-library.com/docs/queries/about>
* <https://testing-library.com/docs/ecosystem-jest-dom/>

### 3) Accessibility Essentials for Dashboard-like Interfaces

What authoritative docs emphasize:

* Use semantic structure and programmatic relationships (WCAG 1.3.1).
* Do not convey meaning by color alone (WCAG 1.4.1).
* Meet text and UI contrast expectations (WCAG 1.4.3 and 1.4.11).
* Ensure keyboard operability and visible focus state (WCAG 2.1.1 and 2.4.7).
* Ensure stable focus order (WCAG 2.4.3).
* Expose status updates programmatically (WCAG 4.1.3).
* For ARIA, follow the principle that no ARIA is better than bad ARIA; prefer native semantics first.
* Use polite live updates for non-critical status messages where appropriate.

Practical essentials to apply to this project UI:

* Landmarks and structure:
  * Use header/main/section/footer and labeled headings
  * Use table/list semantics for data regions instead of div-only layouts
* Status semantics:
  * Use role="status" and/or aria-live="polite" for refresh/result updates
  * Avoid moving focus when status text changes
* Visual status encoding:
  * Pair color with text labels or icons (for example, "Critical", "Warning", "Action Required")
* Keyboard and focus:
  * Ensure all interactive controls are keyboard reachable
  * Keep visible focus ring and non-obscured focus targets
* Contrast:
  * Verify critical text and state indicators against contrast criteria

Sources:

* <https://www.w3.org/WAI/WCAG22/quickref/>
* <https://www.w3.org/WAI/ARIA/apg/patterns/>
* <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role>
* <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live>
* <https://react.dev/reference/react/useId>

### 4) Styling Approach Tradeoffs for Minimal Dependencies

Vite-native options and tradeoffs:

* Plain global/scoped CSS files:
  * Pros: zero extra dependency, easiest for one-screen prototype, fast iteration
  * Cons: naming collisions grow with scope; harder long-term encapsulation
* CSS Modules (.module.css):
  * Pros: local scoping, still zero dependency, easy migration path from simple CSS
  * Cons: slightly more ceremony in class imports and naming
* UI library styles (for example Fluent UI React v9):
  * Pros: accessible defaults, strong design consistency, production-ready components
  * Cons: significant dependency and styling model overhead (CSS-in-JS via Griffel)

Practical recommendation for this project phase:

* Prefer CSS Modules for component-level styles and keep one global file for design tokens/reset.
* Only introduce Fluent UI components selectively if a specific accessibility or consistency gap is hard to close quickly.

Sources:

* <https://vite.dev/guide/features.html>
* <https://react.dev/learn>
* <https://fluent2.microsoft.design/get-started/develop>

### 5) Deterministic Date Handling in Prototypes

What authoritative docs emphasize:

* Locale-sensitive date output varies by locale/runtime/timezone and should not be compared to hardcoded strings.
* Use Intl.DateTimeFormat with explicit locale/options/timeZone for predictable formatting intent.
* In tests, control time with Vitest fake timers and vi.setSystemTime for deterministic behavior.

Practical guidance for this project:

* In UI code:
  * Create one central formatter utility (for example formatTimestamp) using Intl.DateTimeFormat.
  * Always pass locale (for example en-US) and timeZone (for example UTC for demos) explicitly.
  * Avoid direct scattered calls to new Date().toLocaleString() in components.
* In test code:
  * Use vi.useFakeTimers() and vi.setSystemTime() in setup/teardown for repeatable assertions.

Sources:

* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString>
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat>
* <https://vitest.dev/guide/mocking/dates>

## Concrete Recommendations for This Repository

### Recommended Baseline (Now)

1. Keep current runtime dependencies as-is for P0.
2. Preserve StrictMode in entry (already present) because React documents development-only bug-finding benefits.
3. Add a separate type-check script if absent (for example, tsc --noEmit) to align with Vite guidance on transpile-only behavior.

### Recommended Minimal Test Additions (Now)

1. Add dev dependencies:
   * vitest
   * @testing-library/react
   * @testing-library/jest-dom
   * jsdom
2. Add scripts:
   * test: vitest run
   * test:watch: vitest
3. Configure Vitest with environment: jsdom.
4. Add one smoke test for the dashboard shell and one accessibility-oriented test using getByRole queries.

### Recommended Accessibility Guardrails (Now)

1. Implement semantic landmarks and heading hierarchy in P0 layout.
2. Use text + color for status chips and KPI signals.
3. Ensure refresh and assistant controls are keyboard accessible and visibly focused.
4. Add polite live region for refresh completion/state changes.
5. Prefer native elements before custom ARIA widgets.

### Recommended Styling Strategy (Now)

1. Use CSS Modules for feature sections (KPI band, critical list, warning flags, assistant shell).
2. Keep shared tokens in one global CSS file.
3. Defer Fluent UI dependency until a concrete need justifies it.

### Recommended Deterministic Date Strategy (Now)

1. Add one date utility that accepts Date input and formats through Intl.DateTimeFormat with fixed locale/timeZone.
2. Add test helper that pins system time using vi.setSystemTime.
3. For screenshot mode, default to fixed synthetic timestamps in mock data.

## Suggested Implementation Profile

For this project's current stage, the best fit is:

* Stack: Existing React + TS + Vite
* Tests: Vitest + RTL + jest-dom + jsdom only
* Styling: CSS Modules + minimal global tokens
* A11y: Native semantics first, focused WCAG AA essentials
* Dates: centralized formatter + fixed timezone + mocked clock in tests

This profile maximizes:

* Prototype speed
* Screenshot determinism
* Accessibility baseline quality
* Low dependency footprint

## Clarifying Questions Not Resolved by External Research

The following are product decisions rather than documentation gaps:

* Should screenshot timestamps be displayed in UTC for cross-machine consistency, or in a fixed business timezone?
* Is Fluent UI desired as a hard requirement for visual alignment, or only optional per-component?
* Is a future P1 expected to include browser-level screenshot regression tooling, or remain unit/integration only?

## Remaining Research Gaps

No blocking research gaps remain for the requested scope.
Optional follow-up research could include:

* Lightweight visual regression options compatible with Vite and minimal dependency goals
* Accessibility testing automation options beyond unit-level semantic assertions
* Design token strategy for scaling from P0 screenshot to P1 interactions
