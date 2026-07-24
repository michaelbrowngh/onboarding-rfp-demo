---
title: New Hire Onboarding Command Center
description: Demo-focused React and Vite command center with an operations portal and a candidate portal powered by synthetic JSON data
author: Onboarding Command Center Team
ms.date: 2026-07-24
ms.topic: overview
keywords:
  - onboarding
  - react
  - vite
  - demo
  - command center
estimated_reading_time: 8
---

## Project Synopsis

This repository contains a screenshot-first onboarding prototype that demonstrates two connected user experiences:

* An operations-facing command center for exception management and SLA risk monitoring.
* A candidate-facing onboarding portal for personalized task tracking and assistant-guided support.

The implementation is intentionally demo-first. It uses deterministic, synthetic JSON data and avoids live integrations so teams can iterate quickly on workflow, layout, and user interactions before committing to production architecture.

## Why This Exists

The prototype was built to validate the core onboarding workflow in a controlled environment:

* Surface the most critical exceptions quickly.
* Help operations prioritize actions with visible context.
* Show how AI-assisted interactions can be embedded into onboarding experiences without real backend coupling.

The current experience is optimized for walkthroughs, stakeholder demos, and UI/UX alignment.

## HVE and Copilot Workflow

The initial implementation followed the HVE Research, Plan, and Implement workflow described in the project specification:

* Research to identify the smallest viable implementation path.
* Phased planning with entry and exit criteria.
* Incremental implementation and validation against screenshot and behavior goals.

This workflow is captured in the requirements documentation and shaped early architecture decisions, including synthetic data boundaries, route scope, and no-production-integration constraints.

## Requirements and Specification Documents

The project references two key requirements documents:

* [docs/requirements/build-specification.md](docs/requirements/build-specification.md): Core build contract, prototype boundaries, KPI and queue requirements, and phased milestones.
* [docs/requirements/business-requirements-addendum.md](docs/requirements/business-requirements-addendum.md): UI addendum for Microsoft-style visual direction, launcher behavior, and updated interaction rules.

Use these documents as the source of truth when evaluating changes or adding features.

## Tech Stack

The application uses:

* React 19 for UI composition.
* TypeScript 6 for typed domain models and component safety.
* Vite 8 for fast local development and production builds.
* CSS Modules for scoped component styling.
* Lucide React for iconography.
* Oxlint for linting.

## Repository Structure

Primary app folder:

* [new-hire-onboarding-command-center](.)

Important source areas:

* [src/app](src/app): Page-level experiences.
* [src/components](src/components): Shared dashboard and portal UI components.
* [src/data](src/data): Synthetic JSON data and typed data adapters.
* [src/domain](src/domain): Domain types and contracts.
* [src/utils](src/utils): Risk rules and supporting logic.

## The Two Sites in This App

This is one Vite app with two route-based experiences.

### Operations Command Center

Default route:

* [http://localhost:5173/](http://localhost:5173/)

Purpose:

* KPI and queue visibility for onboarding operations.
* Candidate sections grouped by severity and action state.
* Assistant sidecar support for context and guided action flows.

### Candidate Onboarding Portal

Candidate route pattern:

* [http://localhost:5173/portal/:candidateId](http://localhost:5173/portal/:candidateId)

Current seeded demo route:

* [http://localhost:5173/portal/joseph-brown](http://localhost:5173/portal/joseph-brown)

Purpose:

* Candidate checklist and timeline tracking.
* Deterministic AI assistant chat behavior based on seeded intents.
* Support contact and upcoming tasks aligned to operations context.

## Data Model and Demo Boundaries

The app is currently JSON-first and deterministic by design.

Core demo datasets include:

* [src/data/candidateCases.json](src/data/candidateCases.json)
* [src/data/kpiSnapshots.json](src/data/kpiSnapshots.json)
* [src/data/slaDefinitions.json](src/data/slaDefinitions.json)
* [src/data/demoDate.json](src/data/demoDate.json)
* [src/data/customerPortalSeeds.json](src/data/customerPortalSeeds.json)

What this means today:

* No database.
* No external APIs.
* No real HR, CRM, identity, email, or ticketing integrations.
* No sensitive production data.

## Prerequisites for New Developers

Install the following locally:

* Node.js 20.19+ or 22.12+.
* npm 10+.
* Git.
* A modern browser such as Edge or Chrome.

Optional but recommended:

* VS Code with TypeScript and ESLint/Lint tooling extensions.

## Dependencies You Should Know

Runtime dependencies:

* react
* react-dom
* lucide-react

Development dependencies:

* vite
* typescript
* @vitejs/plugin-react
* oxlint
* @types/node
* @types/react
* @types/react-dom

See exact versions in [package.json](package.json).

## How to Run the Project

Open a terminal and run commands from:

* [new-hire-onboarding-command-center](.)

> [!IMPORTANT]
> Run npm commands from the app folder, not the repository root.
> If your terminal is at onboarding-rfp-demo, change into new-hire-onboarding-command-center first.

From the repository root, use:

```bash
cd new-hire-onboarding-command-center
npm install
npm run dev
```

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Then open:

* Operations site: [http://localhost:5173/](http://localhost:5173/)
* Candidate site: [http://localhost:5173/portal/joseph-brown](http://localhost:5173/portal/joseph-brown)

## Useful Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

What they do:

* dev: Starts Vite with hot module replacement.
* build: Runs TypeScript project build and Vite production build.
* preview: Serves built assets locally for verification.
* lint: Runs Oxlint checks.

## Demo-First Assumptions

The current implementation is intentionally configured for demo reliability:

* Deterministic sample data.
* Deterministic chat intent responses.
* No authentication or authorization gates.
* No persistence of user interactions.
* No backend services.

This enables rapid feedback cycles and predictable demos but is not sufficient for production operations.

## What Is Needed for Production Readiness

To move this project toward production, plan work across these areas:

### Architecture and Integrations

* Introduce a backend service boundary for reads and writes.
* Replace synthetic JSON with governed data sources and APIs.
* Add robust error handling, retries, and fallback states.

### Security and Identity

* Add authentication and role-based authorization.
* Protect APIs, secrets, and environment configuration.
* Add audit logging and access traceability.

### Data and Compliance

* Define PII handling and retention policies.
* Add data validation and schema contracts.
* Introduce secure configuration for regional and legal requirements.

### Quality and Testing

* Add unit, component, and end-to-end test coverage.
* Add visual regression checks for critical screens.
* Expand linting and static analysis rules.

### Observability and Operations

* Add telemetry, tracing, and alerting.
* Add health checks and operational runbooks.
* Define deployment pipelines, environment promotion, and rollback strategy.

### Accessibility and UX Hardening

* Perform full keyboard and screen-reader validation.
* Validate color contrast and focus treatment across themes.
* Add loading, empty, and failure states for all primary flows.

## Developer Notes

* Keep route behavior stable for demos unless requirements change.
* Update JSON seed data intentionally to preserve deterministic walkthroughs.
* Align any feature addition to [docs/requirements/build-specification.md](docs/requirements/build-specification.md) and [docs/requirements/business-requirements-addendum.md](docs/requirements/business-requirements-addendum.md).
