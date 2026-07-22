# New Hire Onboarding Command Center Instructions

## Product scope

This repository contains a screenshot-first prototype for a New Hire
Onboarding Operations Command Center.

The primary user is an onboarding operations analyst working from a shared
exception queue.

## Source of truth

Follow:

docs/requirements/build-specification.md

Where generated research or implementation suggestions conflict with the
specification, the specification takes precedence unless the change is
explicitly approved.

## Technology

- React
- TypeScript
- Vite
- Synthetic local data
- Minimal dependencies
- Accessible components
- Deterministic mocked assistant interactions

## P0 scope

P0 is one polished 1440 x 900 command-center screen containing:

- command-center header
- Prototype - Synthetic data label
- Refresh control
- KPI band
- AI-generated KPI summary
- Candidates - Critical section
- Candidates - Action Required section
- Candidates - Warning / Flags section
- visible candidate next actions
- docked assistant shell

## Restrictions

- Do not add a backend.
- Do not add authentication.
- Do not add a database.
- Do not connect to CRM, SuccessFactors, email, payroll, HR, ITSM, or other
  external systems.
- Do not create a real AI agent.
- Do not use real candidate or employee information.
- Do not expand P0 into candidate detail pages, routing, administration,
  dashboards for other personas, or production infrastructure.
- Do not claim that simulated actions affected real systems.
- Do not communicate severity through color alone.

## Engineering expectations

- Use strict TypeScript types.
- Keep risk thresholds configurable.
- Prefer small focused components.
- Run lint, tests, type checking, and build validation after implementation.
- Report errors honestly.