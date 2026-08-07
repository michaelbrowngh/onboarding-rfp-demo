# New Hire Onboarding Operations Command Center
## HVE / GitHub Copilot Build Specification - Version 0.2

**Purpose:** Build a screenshot-first React prototype that demonstrates how onboarding operations can see KPI risk, prioritize candidate exceptions, and move directly into an assistant or automation action from one command-center workspace.

> **Prototype boundary:** Use synthetic data only. Do not connect to real Microsoft, CRM, SuccessFactors, email, HR, payroll, benefits, ITSM, identity, or vendor endpoints. P0 is a visual prototype. P1 may use deterministic mocked interactions. No production agent or real system update is required.

---

## 1. Product Decision

Use the working title **New Hire Onboarding Operations Command Center**.

The primary user is the **shared onboarding operations team**. The main page is a daily exception-management workspace, not a hiring-manager dashboard and not a candidate portal.

The dashboard itself must show status, risk, and next action immediately. The assistant is used for deeper explanation, option comparison, drafting, and human-approved actions. Do not make the user ask the assistant for basic information that belongs on the page.

---

## 2. HVE Execution Contract

Treat this file, the approved BRD, and the BRD addendum as the source of truth.

Use the HVE Research-Plan-Implement workflow:

1. **Task Researcher** - inspect the repository and recommend the simplest implementation.
2. **Task Planner** - create phased work with entry/exit criteria.
3. **Task Implementor** - run with `phaseStop=true` and stop after every phase.
4. **Review** - validate the screenshot and controlled demo against this specification.

Do not let an HVE-generated recommendation expand the prototype into a production system. When generated research or a plan conflicts with the approved scope, this specification wins unless the conflict is explicitly reviewed and documented.

---

## 3. Delivery Milestones

### P0 - Screenshot concept (build first)

Required:

- One polished 1440 x 900 desktop screen.
- Command-center header and Refresh action.
- Compact monthly KPI area.
- AI-generated KPI summary.
- Three visible stacked sections:
  - Candidates - Critical
  - Candidates - Action Required
  - Candidates - Warning / Flags
- Candidate rows with visible next actions.
- Floating assistant launcher at the bottom-left that expands into the assistant panel.
- Synthetic deterministic data.

Not required:

- Working AI agent.
- Backend or persistence.
- Actual email delivery.
- Actual CRM or SuccessFactors update.
- Authentication.
- Live refresh.
- Candidate detail drawer.

### P1 - Clickable prototype (next thin slice)

Add:

- Candidate selection.
- Action buttons that open the sidecar with a pre-created prompt.
- Deterministic assistant messages and suggested choices.
- Draft-email preview.
- Human confirmation.
- Optional local-only state changes.

### Future production

Potential future work includes live data, source-system writeback, email delivery, real agent/tool integration, audit, monitoring, security, responsible AI, and production support.

---

## 4. Technology and Constraints

- React, TypeScript, and Vite.
- Node.js version compatible with the current Vite release.
- Prefer Fluent UI React where it improves consistency, but keep dependencies small.
- Use local TypeScript or JSON mock data.
- No database and no required backend.
- Use a deterministic demo date rather than `new Date()` throughout business logic.
- Use CSS modules, scoped CSS, or a simple maintainable styling approach.
- Use a small charting library only if it materially improves the KPI area.
- No secrets, tokens, production URLs, or real PII.
- The application must work after `npm install` and `npm run dev`.

---

## 5. Visual Reference and Main Layout

The supplied stakeholder mockup is the layout reference. It shows:

1. A rounded command-center canvas.
2. A top KPI band with two or more compact metrics.
3. An AI summary directly below or inside the KPI band.
4. Three stacked candidate sections.
5. A floating assistant launcher at the bottom-left that expands into a panel.
6. A visible Refresh action.

Recommended 1440 x 900 grid:

```text
+----------------------------------------------------------------------------------+
| Command Center                                    Last refresh        [Refresh]  |
| +----------------------------------------------------------+ +------------------+ |
| | KPI 1 | KPI 2 | KPI 3 | KPI 4 | At risk | Projected miss| | Assistant        | |
| | AI summary of KPI risk and likely drivers                | |                  | |
| +----------------------------------------------------------+ | candidate context| |
|                                                              | options / drafts | |
| Candidates - Critical                                        | confirmation     | |
| [candidate cards or compact rows]                             |                  | |
|                                                              |                  | |
| Candidates - Action Required                                 |                  | |
| [candidate cards or compact rows]                             |                  | |
|                                                              |                  | |
| Candidates - Warning / Flags                                 |                  | |
| [candidate cards or compact rows]                             |                  | |
| +----------------------------------------------------------+ +------------------+ |
+----------------------------------------------------------------------------------+
```

Use approximately 100% of the width for the command center content area. The assistant is a floating overlay that does not reserve a permanent column.

The P0 screen should not resemble a spreadsheet. Use concise cards or rows, clear labels, whitespace, and status badges.

---

## 6. Header Requirements

Show:

- `New Hire Onboarding Command Center`
- `Last refreshed: <time>`
- `Refresh` button
- Optional compact selector for region or time period

Do not spend P0 time on navigation, profile menus, or role switching.

---

## 7. KPI and SLA Requirements

Use the supplied KPI catalogue as the baseline configuration.

| ID | KPI | SLA | Target |
|---|---|---|---:|
| KPI-01 | Background check: Initiate | <24 hours after offer acceptance (OA) | 99% |
| KPI-02 | Visa / immigration: Initiate | <24 hours after OA immigration assessment completed | 99% |
| KPI-03 | NHDR: Initiate | <48 hours after re-hire confirmation from candidate | 95% |
| KPI-04 | Employment contract / agreement given | <48 hours after OA / candidate-step completion | 95% |
| KPI-05 | Background check: Confirm clearance | <24 hours after pass from GS | 99% |
| KPI-06 | Start date: Options given | <24 hours after all prerequisites met | 99% |
| KPI-07 | Start date: Confirmation | <24 hours after candidate / hiring-manager agreement | 99% |
| KPI-08 | MPH (Manage Pending Hire) | <48 hours after confirmation of start date | 99% |
| KPI-09 | Backdated start dates - internal and external | No allowed backdating | 0 |

### P0 KPI presentation

Display eight KPI cards above the fold. Each KPI card must show:

- Current-month performance.
- Target.
- Count currently near SLA.
- Count projected to miss.
- A visible status indicator (`On track`, `Watch closely`, or `Critical risk`).

Prominently show total candidates in the pipeline and the number approaching or projected to miss SLA. Monthly compliance percentages can be visually smaller.

Add one concise AI-generated summary, for example:

> 12 candidates are approaching an SLA threshold. Background-check initiation is the largest current risk, driven by six cases waiting on candidate data and three stale CRM assignments.

The summary is mock text or generated deterministically from the local dataset.

---

## 8. Priority Sections

P0 uses three stacked sections, not tabs.

### 8.1 Candidates - Critical

Show all critical candidates currently in the synthetic dataset. A count alone is not sufficient.

### 8.2 Candidates - Action Required

Show candidates waiting on an operations analyst, human decision, communication, or approval.

### 8.3 Candidates - Warning / Flags

Show non-critical cases that should be watched, including negative sentiment, high communication volume, stale tickets, or approaching deadlines.

### 8.4 Secondary all-candidates view

An all-candidates view is optional for P0 and may be deferred to P1 as a separate route, drawer, or modal.

---

## 9. Candidate Row / Card Contract

Every listed candidate must show these fields:

```text
[Candidate] - [Step] - [Status] - [Description] - [Next Step]
```

Recommended rendered fields:

- Candidate name.
- Queue/severity badge.
- Process step number.
- Phase or Microsoft step.
- Current status.
- Plain-language description of risk.
- SLA clock or start-date proximity when relevant.
- Recommended next step.
- Action button.

Example:

```text
Joe Brown | Step 21 - Contract Creation | Critical
Starts in 2 days. Employment contract is unsigned and required documents are incomplete.
Next step: Follow up immediately and review whether the start date is feasible.
[Review with Assistant]
```

Keep the reason readable without opening a detail page.

---

## 10. Process Model

Represent the end-to-end process as grouped phases.

| Phase | Steps | Representative work |
|---|---:|---|
| Ticket Tracking Control | 1-3 | Offer accepted, CRM intake and assignment, PCN/RTM validation, missing data |
| Preboarding Checks | 4-11 | Background, citizenship, work authorization, immigration, relocation, medical |
| Onboarding 2.0 | 12-16 | Re-hire validation, portal setup, NHDR, candidate data, document review |
| Pre-Start Date and HR Handoff | 17-26 | Record center, clearance, start date, contract, pending hire, IT, payroll, benefits |
| Pre-Day 1 | 27-32 | Day 1 readiness, facilities, local IT, greeter, arrangements, signatures |
| Day 1 and Closure | 33-34 | Probation/compliance follow-up and case closure |

Use the process step to make candidate risk understandable and to seed assistant context.

---

## 11. Risk Classification

Use a pure utility module so rules can be tested and changed.

```ts
export type QueueCategory =
  | 'critical'
  | 'action-required'
  | 'warning'
  | 'on-track';
```

Illustrative P0/P1 rules:

- **Critical**
  - Start date is today or within 2 days and a blocking prerequisite is incomplete; or
  - 20% or less of an SLA window remains and the required step is incomplete.
- **Action Required**
  - A human decision, communication, or operations task is waiting; or
  - The case has crossed a configurable action threshold.
- **Warning**
  - Negative sentiment or high unresolved communication volume;
  - Vendor or department ticket is stale;
  - Candidate is approaching an SLA or start-date threshold but is not yet critical.
- **On Track**
  - No blocker and milestones remain within target.

Place these thresholds in configuration. Add a code comment explaining that the 20%, 30%, and 50% concepts are working prototype assumptions and require SME validation.

---

## 12. Action Model

Not every action should use chat.

```ts
export type ActionMode = 'automation' | 'assistant' | 'none';
```

### Direct automation

Use when the future behavior is deterministic, such as:

- Initiate a ticket or workflow.
- Update a confirmed start date across systems.
- Trigger a reminder.
- Escalate a stale ticket.

P0 shows the action button. P1 may show a simulated confirmation.

### Assistant-assisted action

Use when the user needs reasoning, options, drafting, or human approval, such as:

- Explain why a candidate is at risk.
- Compare start-date options.
- Summarize unresolved questions.
- Draft a candidate email.
- Prepare an escalation note.

The action button must pre-create the assistant prompt using candidate context.

---

## 13. Assistant Sidecar

The sidecar is visible in P0 and interactive in P1.

### Visual behavior

- Anchor a launcher button at the bottom-left of the viewport.
- Expand a floating assistant panel when the launcher is activated.
- Keep the command center visible while the panel overlays the page.
- Header: `Onboarding Operations Assistant`.
- Label: `Demo simulation`.
- Show selected candidate and issue category.
- Use suggested actions and buttons rather than depending on arbitrary free-form text.

### Pre-created prompt contract

When an action opens the sidecar, generate a prompt containing:

- Candidate ID and display name.
- Process step and phase.
- Start date.
- Current blocker.
- SLA name, due time, and elapsed percentage.
- Recent activity and communication summary.
- Recommended action.
- Requested assistant task.

Example:

```text
Review Joe Brown's case. He is at Step 21 - Contract Creation and starts in 2 days.
The employment contract is unsigned and required documents are incomplete.
Explain why the start date is at risk and provide the safest next-step options.
```

### P1 conversation states

1. Context loaded.
2. Risk explanation.
3. Options presented.
4. Option selected.
5. Draft or confirmation shown.
6. Human approves or cancels.
7. Simulation result displayed.

Do not claim a real email was sent or a real system was updated.

---

## 14. Required Synthetic Scenarios

| Candidate | Queue | Scenario | Action |
|---|---|---|---|
| Joe Brown | Critical | Starts in 2 days; unsigned employment contract and incomplete documents | Follow up and review start date |
| Kevin Reed | Action Required | Cannot start Monday and needs a one-week start-date change | Confirm with HM/HR and prepare update |
| Bob Carter | Warning | High communication volume and negative sentiment during background check | Summarize and draft outreach |
| Maya Patel | Critical | 20 hours elapsed in a 24-hour background-initiation SLA; candidate data missing | Request data and initiate/escalate check |
| Sofia Martinez | Warning | IT equipment ticket stale; shipping may miss Day 1 | Expedite or arrange temporary device |
| Taylor Morgan | On Track | Checks complete; accounts and equipment ready | No action |

Use deterministic dates relative to a configurable demo date.

---

## 15. TypeScript Domain Model

```ts
export interface SlaDefinition {
  id: string;
  name: string;
  targetPercent: number;
  windowHours?: number;
  triggerDescription: string;
}

export interface SlaState {
  slaId: string;
  startedAt?: string;
  dueAt?: string;
  elapsedPercent: number;
  state: 'within-sla' | 'approaching' | 'critical' | 'missed';
}

export interface CandidateCase {
  id: string;
  name: string;
  role?: string;
  location?: string;
  hiringManager?: string;
  startDate: string;
  stepNumber: number;
  phase: string;
  microsoftStep?: string;
  status: string;
  queueCategory: 'critical' | 'action-required' | 'warning' | 'on-track';
  description: string;
  nextStep: string;
  actionMode: 'automation' | 'assistant' | 'none';
  actionLabel?: string;
  blocker?: string;
  sla?: SlaState;
  sentiment?: 'positive' | 'neutral' | 'concerned' | 'negative';
  messagesLast7Days?: number;
  unresolvedQuestions?: number;
  lastActivityAt: string;
}

export interface KpiSnapshot {
  slaId: string;
  currentPercent: number;
  targetPercent: number;
  nearSlaCount: number;
  projectedMissCount: number;
  trend: 'up' | 'flat' | 'down';
}

export interface AssistantContext {
  candidateId: string;
  issueCategory: string;
  generatedPrompt: string;
  suggestedActions: Array<{
    id: string;
    label: string;
    actionMode: 'automation' | 'assistant';
  }>;
}
```

Keep P0 data simple. Do not create full production schemas.

---

## 16. Recommended Repository Structure

```text
new-hire-onboarding-command-center/
├─ .github/
│  ├─ copilot-instructions.md
│  └─ instructions/
├─ docs/
│  ├─ requirements/
│  │  ├─ business-requirements.docx
│  │  ├─ business-requirements-addendum.md
│  │  └─ build-specification.md
│  ├─ images/
│  │  └─ command-center-concept-mockup.png
│  └─ demo/
│     └─ demo-script.md
├─ .copilot-tracking/
├─ src/
│  ├─ app/
│  │  └─ App.tsx
│  ├─ components/
│  │  ├─ CommandCenter.tsx
│  │  ├─ KpiBand.tsx
│  │  ├─ AiKpiSummary.tsx
│  │  ├─ CandidateSection.tsx
│  │  ├─ CandidateCaseCard.tsx
│  │  ├─ AssistantSidecar.tsx
│  │  └─ common/
│  ├─ data/
│  │  ├─ slaDefinitions.ts
│  │  ├─ kpiSnapshots.ts
│  │  ├─ candidateCases.ts
│  │  └─ assistantScenarios.ts
│  ├─ domain/
│  │  └─ onboarding.ts
│  ├─ utils/
│  │  ├─ riskRules.ts
│  │  └─ promptBuilder.ts
│  ├─ styles/
│  │  └─ tokens.css
│  └─ main.tsx
├─ tests/
├─ README.md
└─ package.json
```

Do not build candidate detail, routing, services, state stores, or charts until they are needed.

---

## 17. Visual Direction

- Light neutral background.
- White command-center card with subtle border/shadow.
- Dark navy and Microsoft-style blue accents.
- Critical: red plus icon/text.
- Action Required: blue plus icon/text.
- Warning: amber plus icon/text.
- On Track: green plus icon/text.
- Compact KPI cards.
- High information density without spreadsheet styling.
- Floating assistant panel feels integrated but visually distinct.
- Do not communicate status through color alone.

The blue rectangles in the supplied mockup indicate hierarchy and placement, not final component styling.

---

## 18. Accessibility and UX

- Keyboard-accessible buttons and candidate rows.
- Visible focus.
- Semantic headings for the three priority sections.
- Text and icon labels for queue status.
- Sufficient contrast.
- Assistant panel has an accessible name.
- Avoid tiny chart labels in the 1440 x 900 screenshot.
- Do not hide the risk reason behind hover-only interactions.

---

## 19. P0 Acceptance Criteria

The screenshot build is complete when:

- The page renders at 1440 x 900 without clipping or scrolling in the primary screenshot state.
- KPI band, AI KPI summary, Critical, Action Required, Warning / Flags, Refresh, and assistant launcher are visible.
- The KPI band shows exactly eight KPI cards and each card includes a visible status indicator.
- Each candidate row shows Candidate, Step, Status, Description, and Next Step.
- The dataset contains at least two critical, two action-required, two warning, and one on-track case.
- KPI values and candidate stories are internally consistent.
- No real integrations, PII, secrets, or production URLs exist.
- `npm run build` succeeds.

---

## 20. P1 Acceptance Criteria

The clickable build is complete when:

- At least three candidate action buttons open the correct sidecar context.
- The sidecar prompt is generated from the selected candidate data.
- SLA risk, start-date action, and communication-warning scenarios are deterministic.
- A draft email or confirmation can be displayed and approved/cancelled.
- Simulation labels remain visible.
- Optional local changes do not require a backend.
- Type check, tests, and build succeed.

---

## 21. Tests

P0 minimum:

1. Risk classification utility.
2. Candidate grouping into the three sections.
3. KPI projected-miss and near-SLA counts.
4. Prompt-builder output for a candidate.
5. Rendering all required sections.

P1 additional:

6. Action button loads the correct candidate context.
7. Suggested action advances the deterministic scenario.
8. Human confirmation can approve or cancel.
9. Keyboard access to the primary sidecar controls.

---

## 22. HVE Build Sequence

### Research

Select **Task Researcher** and run:

```text
/task-research topic="Research the simplest React, TypeScript, and Vite implementation for the New Hire Onboarding Operations Command Center described in docs/requirements/build-specification.md. The first milestone is one screenshot-ready 1440x900 screen with a KPI band, AI KPI summary, three stacked candidate-priority sections, Refresh action, and a floating assistant launcher that expands a sidecar panel. Survey the current repository, recommend component boundaries, local data structures, risk-rule configuration, prompt-building approach, accessibility treatment, and minimal dependencies. Do not implement code. Do not recommend a backend, authentication, real AI model, or external HR integration."
```

### Plan

Select **Task Planner** and run:

```text
/task-plan research=.copilot-tracking/research/<research-file>.md Turn the research into two phases. Phase 1 is the P0 screenshot concept only. Phase 2 is the optional P1 deterministic sidecar interaction. Include exact files, entry/exit criteria, validation commands, and a human stop after each phase. Do not add production infrastructure or unapproved features.
```

### Implement

Select **Task Implementor** and run:

```text
/task-implement phaseStop=true Implement Phase 1 of the approved command-center plan. Build only the 1440x900 screenshot state with synthetic data, KPI band, AI KPI summary, Critical, Action Required, Warning / Flags sections, Refresh control, and a floating assistant launcher that expands the sidecar panel. Stop after the phase, run type check/tests/build, and wait for review before adding interactions.
```

---

## 23. Ready-to-Paste P0 Copilot Prompt

```text
Read the complete New Hire Onboarding Operations Command Center build specification.

Create a concise implementation plan for P0 only. Do not build the entire future application.

P0 must be one screenshot-ready React + TypeScript + Vite screen at 1440x900 with:
- command-center header
- last refresh and Refresh button
- compact monthly KPI band with eight KPI cards
- AI KPI summary
- Candidates - Critical section
- Candidates - Action Required section
- Candidates - Warning / Flags section
- candidate rows showing Candidate, Step, Status, Description, Next Step, and action
- floating bottom-left assistant launcher that expands the sidecar panel

Use local deterministic mock data. Do not create a backend, authentication, real agent, real email, source-system update, candidate detail drawer, or unnecessary routing.

Before editing, list the exact files you will create or modify. After implementation, run type check, tests, and build, then stop.
```

---

## 24. Suggested `.github/copilot-instructions.md`

```md
# Repository Instructions

- This repository is a screenshot-first prototype for a New Hire Onboarding Operations Command Center.
- Use React and TypeScript with strict typing.
- Use synthetic data only. Never add real candidate data, credentials, production URLs, or real HR endpoints.
- P0 is one 1440x900 command-center screen. Do not expand scope without an approved plan.
- The page must show status and risk directly; the assistant is for deeper analysis and actions.
- Distinguish direct automation actions from assistant-assisted actions.
- The assistant is deterministic and simulated unless the specification is formally changed.
- Keep risk thresholds configurable and label them as prototype assumptions.
- Prefer small accessible components and minimal dependencies.
- Do not use color as the only indicator of severity.
- Run type checks, tests, and build after changes and report failures honestly.
```
