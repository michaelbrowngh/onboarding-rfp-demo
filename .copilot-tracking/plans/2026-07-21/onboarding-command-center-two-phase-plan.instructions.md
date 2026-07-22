---
applyTo: '.copilot-tracking/changes/2026-07-21/onboarding-command-center-two-phase-changes.md'
---
<!-- markdownlint-disable-file -->
# Implementation Plan: Onboarding Command Center Two-Phase Delivery

## Overview

Deliver a controlled two-phase React + TypeScript + Vite implementation where Phase 1 produces a deterministic P0 screenshot-ready command center and Phase 2 optionally adds deterministic local click-flow interactions.

## Objectives

### User Requirements

* Implement a two-phase plan using provided research input — Source: user request with research argument
* Keep Phase 1 strictly P0 with one polished 1440x900 screenshot-ready state and required visual elements — Source: user request phase definition
* Keep Phase 2 optional P1 with deterministic candidate selection, assistant prompt/response, draft email preview, confirmation, and optional local-only state change — Source: user request phase definition
* Define exact files, dependencies, implementation steps, entry criteria, exit criteria, validation commands, and a human approval stop for each phase — Source: user request explicit format requirement
* Exclude production infrastructure, authentication, backend, database, real AI, real email, and external integrations — Source: user request scope guardrail

### Derived Objectives

* Use minimal custom component composition with local deterministic data and CSS Modules to satisfy screenshot and interaction requirements without added production complexity — Derived from: selected approach in research findings
* Preserve clear phase gates so P1 work cannot begin until explicit Phase 1 human approval is complete — Derived from: controlled delivery and approval-stop requirement

## Context Summary

### Project Files

* new-hire-onboarding-command-center/src/App.tsx - Current starter shell to be replaced by command center composition
* new-hire-onboarding-command-center/src/index.css - Current global styles to be aligned with deterministic prototype visuals
* new-hire-onboarding-command-center/package.json - Current scripts for lint/build/dev validation
* new-hire-onboarding-command-center/docs/requirements/build-specification.md - P0/P1 requirement anchors and constraints

### References

* .copilot-tracking/research/2026-07-21/onboarding-command-center-p0-simplest-react-vite-research.md - Primary research source provided for planning
* .copilot-tracking/plans/logs/2026-07-21/onboarding-command-center-two-phase-log.md - Discrepancy tracking and implementation path record

### Standards References

* c:/Users/michael.brow/.vscode/extensions/ise-hve-essentials.hve-core-all-3.2.2/.github/instructions/hve-core/markdown.instructions.md — Markdown structure and linting conventions
* c:/Users/michael.brow/.vscode/extensions/ise-hve-essentials.hve-core-all-3.2.2/.github/instructions/hve-core/writing-style.instructions.md — Writing voice and style conventions for planning artifacts

## Implementation Checklist

### [x] Implementation Phase 1: P0 Screenshot Baseline

<!-- parallelizable: false -->

* [x] Step 1.1: Establish deterministic local domain and demo data
  * Details: .copilot-tracking/details/2026-07-21/onboarding-command-center-two-phase-details.md (Lines 11-42)
* [x] Step 1.2: Implement P0 command center layout and required screenshot elements
  * Details: .copilot-tracking/details/2026-07-21/onboarding-command-center-two-phase-details.md (Lines 44-82)
* [x] Step 1.3: Apply scoped styling for screenshot quality and deterministic layout
  * Details: .copilot-tracking/details/2026-07-21/onboarding-command-center-two-phase-details.md (Lines 84-109)
* [x] Step 1.4: Validate P0 and execute human approval stop
  * Details: .copilot-tracking/details/2026-07-21/onboarding-command-center-two-phase-details.md (Lines 111-132)

### [ ] Implementation Phase 2: Optional P1 Clickable Experience

<!-- parallelizable: false -->

* [ ] Step 2.1: Add deterministic selection and assistant prompt preparation
  * Details: .copilot-tracking/details/2026-07-21/onboarding-command-center-two-phase-details.md (Lines 138-162)
* [ ] Step 2.2: Implement deterministic assistant responses and draft email preview with confirmation
  * Details: .copilot-tracking/details/2026-07-21/onboarding-command-center-two-phase-details.md (Lines 164-191)
* [ ] Step 2.3: Validate P1, run final scoped validation, and execute human approval stop
  * Details: .copilot-tracking/details/2026-07-21/onboarding-command-center-two-phase-details.md (Lines 193-210)

## Planning Log

See .copilot-tracking/plans/logs/2026-07-21/onboarding-command-center-two-phase-log.md for discrepancy tracking, implementation paths considered, and suggested follow-on work.

## Dependencies

* Node.js LTS compatible with Vite 7
* npm for dependency and script execution
* Existing React + TypeScript + Vite scaffold in new-hire-onboarding-command-center

## Success Criteria

* Phase 1 produces one polished deterministic 1440x900 screenshot-ready state containing all required P0 elements — Traces to: user phase-1 requirement and research selected approach
* Phase 2 is optional and deterministic with selection, prompt, response, draft preview, confirmation, and optional local-only state change — Traces to: user phase-2 requirement
* Each phase has explicit entry criteria, exit criteria, validation commands, and human approval stop — Traces to: user required plan format
* No excluded capabilities are introduced (production infra/auth/backend/database/real AI/real email/external integrations) — Traces to: user exclusion constraints
