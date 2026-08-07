<!-- markdownlint-disable-file -->
# Release Changes: Onboarding Command Center Two-Phase Delivery

**Related Plan**: .copilot-tracking/plans/2026-07-21/onboarding-command-center-two-phase-plan.instructions.md
**Implementation Date**: 2026-07-21

## Summary

Phase 1 delivers a screenshot-ready P0 command center prototype with deterministic local data, a docked assistant shell, and scoped styling tuned for a 1440x900 desktop capture.

## Changes

### Added

* new-hire-onboarding-command-center/src/app/CommandCenterPage.tsx - Composes the P0 command center layout, KPI summary, queue sections, and assistant shell
* new-hire-onboarding-command-center/src/app/CommandCenterPage.module.css - Defines the desktop-first grid, spacing, and layout behavior for the screenshot view
* new-hire-onboarding-command-center/src/components/HeaderBar.tsx - Renders the command-center title, synthetic-data label, refresh metadata, and refresh action
* new-hire-onboarding-command-center/src/components/HeaderBar.module.css - Styles the header layout and metadata treatments
* new-hire-onboarding-command-center/src/components/KpiBand.tsx - Renders KPI cards and aggregate risk counts
* new-hire-onboarding-command-center/src/components/KpiBand.module.css - Styles the KPI band, KPI cards, and queue pressure summary
* new-hire-onboarding-command-center/src/components/AiKpiSummary.tsx - Renders the deterministic AI KPI summary block
* new-hire-onboarding-command-center/src/components/CandidateSection.tsx - Provides the reusable section wrapper for each priority queue
* new-hire-onboarding-command-center/src/components/CandidateSection.module.css - Styles queue sections and section headers
* new-hire-onboarding-command-center/src/components/CandidateRow.tsx - Renders candidate status, description, next-step guidance, and action button content
* new-hire-onboarding-command-center/src/components/CandidateRow.module.css - Styles candidate cards, status indicators, and action controls
* new-hire-onboarding-command-center/src/components/AssistantSidecar.tsx - Renders the visible simulated assistant sidecar for Phase 1
* new-hire-onboarding-command-center/src/components/AssistantSidecar.module.css - Styles the docked assistant shell and its internal panels
* new-hire-onboarding-command-center/src/data/demoDate.ts - Supplies deterministic reporting-period and last-refresh labels
* new-hire-onboarding-command-center/src/data/slaDefinitions.ts - Defines local SLA metadata for the prototype
* new-hire-onboarding-command-center/src/data/candidateCases.ts - Supplies deterministic synthetic onboarding cases across all queue categories
* new-hire-onboarding-command-center/src/data/kpiSnapshots.ts - Supplies deterministic KPI card data
* new-hire-onboarding-command-center/src/domain/onboarding.ts - Defines shared TypeScript domain types for the prototype
* new-hire-onboarding-command-center/src/styles/tokens.css - Defines shared design tokens for color, spacing, type, and focus states
* new-hire-onboarding-command-center/src/utils/riskRulesConfig.ts - Defines configurable prototype thresholds with an SME-validation note
* new-hire-onboarding-command-center/src/utils/riskRules.ts - Implements pure queue grouping and KPI risk summary utilities

### Modified

* new-hire-onboarding-command-center/src/App.tsx - Replaces the starter Vite screen with the command center page entry point
* new-hire-onboarding-command-center/src/index.css - Resets global defaults and applies app-wide prototype foundations
* new-hire-onboarding-command-center/src/App.css - Retires the starter Vite page styling so it no longer drives the UI

### Removed

* None

## Additional or Deviating Changes

* Automated test execution was skipped because the app has no configured test script in package.json
	* Reason: The approved plan prioritized Phase 1 screenshot delivery without adding a new test runner during this slice
* Phase 1 screenshot evidence was captured in .copilot-tracking/artifacts/2026-07-21/p0-command-center-1440x900.png using the local dev server and browser tooling
	* Reason: The implementation details require a screenshot artifact before the human review stop

## Release Summary

Phase 1 affected 24 application files and one artifact path to replace the starter Vite screen with a deterministic onboarding operations command center. The delivered slice adds typed local domain/data modules, pure risk utilities, small presentational React components, CSS Modules, and shared visual tokens to satisfy the P0 screenshot contract. Validation passed for lint, TypeScript compilation, and production build; automated tests were not run because no test script is configured. Implementation is now paused for human review before any Phase 2 interaction work begins.