<!-- markdownlint-disable-file -->
# Implementation Details: Onboarding Command Center Two-Phase Delivery

## Context Reference

Sources: .copilot-tracking/research/2026-07-21/onboarding-command-center-p0-simplest-react-vite-research.md, new-hire-onboarding-command-center/docs/requirements/build-specification.md, user request scope constraints.

## Implementation Phase 1: P0 Screenshot Baseline

<!-- parallelizable: false -->

### Step 1.1: Establish deterministic local domain and demo data

Create deterministic domain types and synthetic demo data to guarantee a repeatable screenshot state at 1440x900.

Files:
* new-hire-onboarding-command-center/src/domain/onboarding.ts - Add shared types for candidates, KPI snapshots, queue categories, and assistant context
* new-hire-onboarding-command-center/src/data/demoDate.ts - Add fixed timestamp constants
* new-hire-onboarding-command-center/src/data/slaDefinitions.ts - Add local SLA/KPI metadata
* new-hire-onboarding-command-center/src/data/candidateCases.ts - Add deterministic candidate records covering Critical, Action Required, and Warning/Flags
* new-hire-onboarding-command-center/src/data/kpiSnapshots.ts - Add fixed KPI card values
* new-hire-onboarding-command-center/src/utils/riskRulesConfig.ts - Add deterministic threshold configuration for queue classification assumptions
* new-hire-onboarding-command-center/src/utils/riskRules.ts - Add pure queue classification and KPI risk computation utilities

Discrepancy references:
* Tracks deterministic prototype assumptions in local utilities and defers SME threshold validation to follow-on work

Entry criteria:
* Vite app builds from current baseline
* No backend/auth/database integration code is required

Success criteria:
* Demo data is fully local and deterministic
* Candidate distribution satisfies all three required queues
* Queue classification and KPI risk computations are implemented in pure utilities
* No runtime dependency additions for production behavior

Context references:
* .copilot-tracking/research/2026-07-21/onboarding-command-center-p0-simplest-react-vite-research.md (Lines 138-182) - Recommended local model and data boundaries

Dependencies:
* None

### Step 1.2: Implement P0 command center layout and required screenshot elements

Build the P0 screen with command-center header, synthetic-data label, refresh action, KPI band, AI KPI summary, three candidate priority sections, candidate cards with next actions, and docked assistant shell.

Files:
* new-hire-onboarding-command-center/src/app/CommandCenterPage.tsx - Compose primary page sections
* new-hire-onboarding-command-center/src/components/HeaderBar.tsx - Header title, Prototype - Synthetic data label, refresh control, last refresh label
* new-hire-onboarding-command-center/src/components/KpiBand.tsx - KPI cards and risk counts
* new-hire-onboarding-command-center/src/components/AiKpiSummary.tsx - Deterministic AI KPI summary text
* new-hire-onboarding-command-center/src/components/CandidateSection.tsx - Reusable queue section wrapper
* new-hire-onboarding-command-center/src/components/CandidateRow.tsx - Candidate card row and next action control
* new-hire-onboarding-command-center/src/components/AssistantSidecar.tsx - Docked assistant shell in simulated state
* new-hire-onboarding-command-center/src/App.tsx - Replace starter app with command center page entry
* new-hire-onboarding-command-center/src/main.tsx - Keep root mounting unchanged except import alignment

Discrepancy references:
* Uses deterministic screenshot acceptance for P0 and defers visual-regression tooling to follow-on work

Entry criteria:
* Step 1.1 deterministic data modules exist
* Semantic landmarks and keyboard focus behavior are defined for all interactive elements

Success criteria:
* A single polished desktop state is renderable for 1440x900 capture
* Required P0 elements are present and labeled
* Assistant shell is visible, docked, and non-networked

Context references:
* .copilot-tracking/research/2026-07-21/onboarding-command-center-p0-simplest-react-vite-research.md (Lines 276-304) - Required component boundaries
* new-hire-onboarding-command-center/docs/requirements/build-specification.md (Lines 41-80) - P0 acceptance anchors

Dependencies:
* Step 1.1 completion

### Step 1.3: Apply scoped styling for screenshot quality and deterministic layout

Add CSS Modules and shared tokens to ensure visual consistency for one desktop screenshot state while avoiding broad global style side effects.

Files:
* new-hire-onboarding-command-center/src/styles/tokens.css - Shared color/spacing/type tokens
* new-hire-onboarding-command-center/src/app/CommandCenterPage.module.css - Page-level grid/layout constraints
* new-hire-onboarding-command-center/src/components/HeaderBar.module.css - Header styling
* new-hire-onboarding-command-center/src/components/KpiBand.module.css - KPI card styling
* new-hire-onboarding-command-center/src/components/CandidateSection.module.css - Queue section styling
* new-hire-onboarding-command-center/src/components/CandidateRow.module.css - Candidate card styling
* new-hire-onboarding-command-center/src/components/AssistantSidecar.module.css - Docked sidecar styling
* new-hire-onboarding-command-center/src/index.css - Reduce starter defaults that conflict with prototype visual direction

Entry criteria:
* Structural components render in App without runtime errors

Success criteria:
* Layout is stable at 1440x900 and remains readable at smaller widths
* Color is not the only status signal
* Focus states are visible for all actionable controls

Context references:
* .copilot-tracking/research/2026-07-21/onboarding-command-center-p0-simplest-react-vite-research.md (Lines 344-360) - Styling and accessibility recommendations

Dependencies:
* Step 1.2 completion

### Step 1.4: Validate P0 and pause for human approval

Run scoped validation, capture screenshot artifact, and stop for explicit human approval before any P1 interactive work begins.

Artifact and approval evidence:
* Screenshot artifact path: .copilot-tracking/artifacts/2026-07-21/p0-command-center-1440x900.png
* Approval record path: .copilot-tracking/plans/logs/2026-07-21/onboarding-command-center-two-phase-log.md under "Approval Records"

Validation commands:
* npm install - Install any missing dev dependencies before validation
* npm run lint - Validate TypeScript and React lint rules
* npm run build - Ensure production build compiles
* npm run dev -- --host - Manual visual verification at 1440x900 viewport

Entry criteria:
* Steps 1.1 through 1.3 complete

Exit criteria:
* Lint and build pass
* Screenshot artifact exists at .copilot-tracking/artifacts/2026-07-21/p0-command-center-1440x900.png
* One approved screenshot-ready state exists
* Human approval is recorded in .copilot-tracking/plans/logs/2026-07-21/onboarding-command-center-two-phase-log.md before proceeding to Phase 2

Dependencies:
* Step 1.3 completion

## Implementation Phase 2: Optional P1 Clickable Experience

<!-- parallelizable: false -->

### Step 2.1: Add deterministic selection and assistant prompt preparation

Enable candidate selection behavior and build a deterministic pre-created assistant prompt from selected candidate context.

Files:
* new-hire-onboarding-command-center/src/utils/promptBuilder.ts - Deterministic prompt text builder
* new-hire-onboarding-command-center/src/app/CommandCenterPage.tsx - Local selected-candidate state and prompt initialization
* new-hire-onboarding-command-center/src/components/CandidateRow.tsx - Selection action wiring
* new-hire-onboarding-command-center/src/components/AssistantSidecar.tsx - Display pre-created prompt block

Entry criteria:
* Human approval for Phase 1 is complete
* P0 screenshot state remains stable

Success criteria:
* Candidate click selects one candidate deterministically
* Assistant prompt content is pre-created and predictable for the selected candidate
* No external API calls are introduced

Context references:
* .copilot-tracking/research/2026-07-21/onboarding-command-center-p0-simplest-react-vite-research.md (Lines 321-339) - Prompt-building model

Dependencies:
* Phase 1 exit criteria completion

### Step 2.2: Implement deterministic assistant responses and draft email preview with confirmation

Provide fixed response options and draft-email preview, requiring explicit human confirmation before any optional local-only state update.

Files:
* new-hire-onboarding-command-center/src/data/assistantResponses.ts - Deterministic response catalog keyed by action type
* new-hire-onboarding-command-center/src/components/AssistantSidecar.tsx - Response selection, draft preview, and confirm UI
* new-hire-onboarding-command-center/src/app/CommandCenterPage.tsx - Local-only state transition toggle after confirmation
* new-hire-onboarding-command-center/src/domain/onboarding.ts - Optional action state type additions

Entry criteria:
* Step 2.1 selection and prompt flow works locally

Success criteria:
* Assistant responses are deterministic and synthetic
* Draft email preview renders before confirmation
* Confirmation gate is required before local-only state change
* No email service, no backend, no database, and no real AI integration exists

Dependencies:
* Step 2.1 completion

### Step 2.3: Validate P1 and pause for human approval

Run phase and final validation for optional interactions and stop for explicit human approval before any additional expansion.

Artifact and approval evidence:
* Optional P1 walkthrough note path: .copilot-tracking/artifacts/2026-07-21/p1-clickflow-validation-notes.md
* Approval record path: .copilot-tracking/plans/logs/2026-07-21/onboarding-command-center-two-phase-log.md under "Approval Records"

Validation commands:
* npm run lint - Validate updated interaction code
* npm run build - Verify optimized build output
* npm run dev -- --host - Manual check of selection, prompt, response, draft, and confirmation flow

Entry criteria:
* Steps 2.1 and 2.2 complete

Exit criteria:
* Interaction flow works deterministically in local UI
* P0 display remains intact
* Full scoped validation is complete (lint and build)
* Human approval is recorded in .copilot-tracking/plans/logs/2026-07-21/onboarding-command-center-two-phase-log.md before any future scope expansion

Dependencies:
* Step 2.2 completion

## Dependencies

* Node.js LTS runtime compatible with Vite 7
* npm package manager

## Success Criteria

* Phase 1 produces one polished, deterministic 1440x900 screenshot state with all required P0 elements
* Phase 2 remains optional and deterministic, with explicit human confirmation gating local-only state change
* All validation commands pass within approved scope boundaries
* No production infrastructure, authentication, backend, database, real AI, real email, or external integrations are introduced
