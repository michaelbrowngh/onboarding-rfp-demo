---
title: Repo Baseline Research
description: Baseline survey of new-hire-onboarding-command-center repository state with evidence and requirement gap analysis
author: GitHub Copilot
ms.date: 2026-07-21
ms.topic: reference
---

## Research Status

* Status: In-Progress
* Scope: Survey current repository baseline for new-hire-onboarding-command-center and document evidence with file paths and line numbers

## Research Questions

* What are the current structure highlights of the repository and app folder?
* What scripts, dependencies, and devDependencies are defined in package.json?
* What is the purpose of App.tsx and what does it currently render?
* What styling approach is currently used in index.css and App.css?
* Is there any existing test setup, configuration, or test files?
* What are the explicit gaps against P0 requirements in docs/requirements/build-specification.md?
* What constraints influence the simplest implementation path?

## Findings

### Current structure highlights

* Workspace root includes `new-hire-onboarding-command-center` as the app folder plus top-level tracking and README artifacts
	* Evidence: `./` listing shows `.copilot-tracking/`, `.git/`, `new-hire-onboarding-command-center/`, `README.md`
* App folder is a Vite + React + TypeScript scaffold with docs and minimal src surface
	* Evidence: `new-hire-onboarding-command-center/` contains `index.html`, `package.json`, `vite.config.ts`, `tsconfig*.json`, `src/`, `public/`, `docs/`, `.oxlintrc.json`
* Requirements and visual reference assets already exist
	* Evidence: `new-hire-onboarding-command-center/docs/requirements/build-specification.md`, `new-hire-onboarding-command-center/docs/requirements/business-requirements.docx`, `new-hire-onboarding-command-center/docs/requirements/command-center-concept-mockup.png`
* Source app currently consists of only five files in `src/`
	* Evidence: `new-hire-onboarding-command-center/src/` contains `App.tsx`, `App.css`, `index.css`, `main.tsx`, `assets/`

### package.json scripts, dependencies, and devDependencies

* Scripts
	* `dev`: `vite`
	* `build`: `tsc -b && vite build`
	* `lint`: `oxlint`
	* `preview`: `vite preview`
	* Evidence: `new-hire-onboarding-command-center/package.json:7-10`
* Dependencies
	* `react`: `^19.2.7`
	* `react-dom`: `^19.2.7`
	* Evidence: `new-hire-onboarding-command-center/package.json:13-14`
* Dev dependencies
	* `@types/node`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `oxlint`, `typescript`, `vite`
	* Evidence: `new-hire-onboarding-command-center/package.json:16-24`
* Observation
	* No UI library, charting library, test framework, or test runner package is present
	* Evidence: `new-hire-onboarding-command-center/package.json:1-24`

### Existing App.tsx purpose and current render output

* Purpose appears to be the default Vite React starter experience, not onboarding command-center content
	* Evidence: `new-hire-onboarding-command-center/src/App.tsx:19-22` (`Get started`, `Edit src/App.tsx and save to test HMR`)
* Component uses local counter state and increment button
	* Evidence: `new-hire-onboarding-command-center/src/App.tsx:8`, `new-hire-onboarding-command-center/src/App.tsx:26-29`
* Layout currently renders:
	* Hero graphic composed from `hero.png`, React logo, and Vite logo
		* Evidence: `new-hire-onboarding-command-center/src/App.tsx:14-16`
	* Documentation and social link sections (Vite, React, GitHub, Discord, X, Bluesky)
		* Evidence: `new-hire-onboarding-command-center/src/App.tsx:35-113`
	* Decorative separators and spacer section
		* Evidence: `new-hire-onboarding-command-center/src/App.tsx:33`, `new-hire-onboarding-command-center/src/App.tsx:116-117`
* Root mount is standard React StrictMode mounting of `App`
	* Evidence: `new-hire-onboarding-command-center/src/main.tsx:1-9`

### Existing styling approach in index.css and App.css

* Styling is global CSS with CSS custom properties, responsive media queries, and nested selector syntax
	* Evidence: `new-hire-onboarding-command-center/src/index.css:1-31`, `new-hire-onboarding-command-center/src/App.css:1-184`
* Theming behavior
	* Defines light and dark token sets; uses `color-scheme: light dark` and `prefers-color-scheme: dark`
	* Evidence: `new-hire-onboarding-command-center/src/index.css:20`, `new-hire-onboarding-command-center/src/index.css:33-51`
* Typography and palette
	* Uses system font stacks and accent-purple token set
	* Evidence: `new-hire-onboarding-command-center/src/index.css:7-17`
* Layout and components are hard-coded to starter sections (`#center`, `#next-steps`, `#docs`, `#spacer`, `.ticks`, `.hero`, `.counter`)
	* Evidence: `new-hire-onboarding-command-center/src/App.css:1`, `new-hire-onboarding-command-center/src/App.css:20`, `new-hire-onboarding-command-center/src/App.css:59`, `new-hire-onboarding-command-center/src/App.css:73`, `new-hire-onboarding-command-center/src/App.css:98`, `new-hire-onboarding-command-center/src/App.css:156`, `new-hire-onboarding-command-center/src/App.css:164`

### Existing test setup status

* No test files found under source tree for common naming patterns
	* Evidence: search `**/*.{test,spec}.{ts,tsx,js,jsx}` returned no files
* No test framework config files found
	* Evidence: no `vitest.config.*`, `jest.config.*`, `playwright.config.*`, or `cypress.config.*`
* No `test` script in package scripts
	* Evidence: `new-hire-onboarding-command-center/package.json:6-10`
* Current baseline status: build/lint/dev only; test harness absent

### Explicit gaps against P0 requirements in build-specification.md

* P0 screen contract is not implemented
	* Requirement asks for 1440x900 command-center screenshot with header, refresh, KPI band, AI summary, three candidate sections, and right docked assistant
	* Evidence requirement: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:41-51`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:536`
	* Evidence current app mismatch: `new-hire-onboarding-command-center/src/App.tsx:19-22`, `new-hire-onboarding-command-center/src/App.tsx:35-113`
* Required header labels missing
	* Missing: `New Hire Onboarding Operations Command Center`, `Prototype - Synthetic data`, `Last refreshed: <time>`, `Refresh`
	* Evidence requirement: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:136-141`
	* Evidence current app: no such strings in `new-hire-onboarding-command-center/src/App.tsx` (current heading is `Get started` at line 19)
* Candidate queue sections missing
	* Missing visible sections: `Candidates - Critical`, `Candidates - Action Required`, `Candidates - Warning / Flags`
	* Evidence requirement: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:45-49`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:202-215`
	* Evidence current app mismatch: `new-hire-onboarding-command-center/src/App.tsx:35-113` renders docs/social sections only
* Candidate row contract missing
	* Missing rendered fields: candidate, step, status, description, next step
	* Evidence requirement: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:229-248`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:537`
* Required synthetic scenario dataset not present
	* Requirement specifies at least two critical, two action-required, two warning, one on-track and named scenarios
	* Evidence requirement: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:538`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:334-341`
	* Evidence current app: no candidate model/data files exist; only starter `src` files are present
* Assistant sidecar contract missing
	* Requirement expects right-docked assistant shell in P0
	* Evidence requirement: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:50`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:304-312`
	* Evidence current app mismatch: no assistant shell component or markup exists in `new-hire-onboarding-command-center/src/App.tsx:1-122`
* P0 test minimum contract currently unmet by setup
	* Requirement includes risk utility tests, grouping tests, KPI counts, prompt builder output, and required section rendering test
	* Evidence requirement: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:562-568`
	* Evidence current baseline: no test framework/config/test files and no test script

### Constraints influencing simplest implementation

* Scope constraints strongly favor front-end-only deterministic implementation
	* Synthetic data only; no real integrations; no production agent/system update
	* Evidence: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:6`
* Tech constraints define stack and runtime expectations
	* React + TypeScript + Vite and app must run with `npm install` + `npm run dev`
	* Evidence: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:82`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:91`
* Data/time constraints simplify logic design
	* Local TypeScript/JSON mock data and deterministic demo date (avoid `new Date()` in business logic)
	* Evidence: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:85`, `new-hire-onboarding-command-center/docs/requirements/build-specification.md:87`
* Styling constraint allows minimal approach
	* CSS modules, scoped CSS, or simple maintainable styling approach accepted
	* Evidence: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:88`
* Dependency constraints suggest small incremental additions only if justified
	* Prefer Fluent UI only when it improves consistency and keep dependencies small
	* Evidence: `new-hire-onboarding-command-center/docs/requirements/build-specification.md:84`
* Baseline codebase is scaffold-simple, enabling low-risk replacement of `App.tsx` and CSS with focused P0 layout
	* Evidence: `new-hire-onboarding-command-center/src/` currently has only starter app files

## References

* new-hire-onboarding-command-center/package.json
* new-hire-onboarding-command-center/src/main.tsx
* new-hire-onboarding-command-center/src/App.tsx
* new-hire-onboarding-command-center/src/index.css
* new-hire-onboarding-command-center/src/App.css
* new-hire-onboarding-command-center/docs/requirements/build-specification.md

## Follow-on Questions

* Should P0 include the optional compact region/time selector in the header or defer it to keep scope minimal?
* For P0 visual implementation, should we stay pure CSS or add Fluent UI components selectively for badges/buttons/panels?
* Should the initial test setup be included in Phase 1 or deferred until after screenshot acceptance?

## Research Status

* Status: Complete
* Summary: Baseline surveyed; evidence captured for structure, dependencies, rendering, styling, test status, and explicit P0 requirement gaps.
