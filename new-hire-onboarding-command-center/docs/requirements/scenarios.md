---
title: Onboarding Demo Scenario Map
description: Candidate-to-scenario mapping for the onboarding command center demo, including queue severity and action flow expectations.
author: Onboarding Command Center Team
ms.date: 2026-08-10
ms.topic: reference
keywords:
  - onboarding
  - scenarios
  - demo data
  - candidate mapping
estimated_reading_time: 4
---

## Scenario overview

This file maps each demo candidate to a scenario so facilitators can run the same storyline consistently.

## Scenario mapping

| Scenario | Candidate | Queue | Core situation | Action flow |
|---|---|---|---|---|
| Scenario 1 | Joseph Brown | Critical | Starts in 2 days with unsigned contract and missing right-to-work attachment | Action with AI: draft and send urgent follow-up email |
| Scenario 2 (Multi-phase) | Sofia Martinez | Critical | Day 1 realignment requires stakeholder confirmation and downstream updates | Phase 1: confirm start date with stakeholders. Phase 2: Action with AI updates CRM, SuccessFactors, EC, and Payroll |
| Scenario 3 | Avery Collins | Critical | Invalid IBAN format blocks payroll handoff | Action with AI: draft and send IBAN correction request |
| Scenario 4 | Nadia Ortiz | Critical | Medical health check incomplete close to start date | Action with AI: draft and send medical completion follow-up |
| Scenario 5 | Leah Chen | Critical | Rapid onboarding within one week requires urgent cross-team coordination | Action with AI: generate high-priority coordination plan |
| Scenario 6 | Aisha Khan | Critical (Hidden in UI) | Background check workflow not initiated near SLA boundary | Review with AI: investigate workflow stall and trigger vendor flow |
| Scenario 7 | Miguel Santos | Action Required | Start date option is unresolved across systems | Automation or assisted reconciliation across ATS, HRIS, and CRM |
| Scenario 8 | Priya Raman | Action Required | Re-hire initiation needs operations approval | Review with AI: confirm re-hire route and queue NHDR packet |
| Scenario 9 | Jordan Patel | Warning | Communication sentiment is degrading with POP stakeholders | Review with AI: analyze message drivers and plan outreach |
| Scenario 10 | Elena Petrova | Warning | Unresolved communication volume indicates ownership confusion | Review with AI: clarify ownership and send guidance |
| Scenario 11 | Daniel Okafor | Warning | Immigration vendor ticket is stale and approaching risk threshold | Review with AI: prepare escalation path |
| Scenario 12 | Morgan Lee | On Track | Day 1 readiness milestones are complete and healthy | No action required, monitor only |

## Notes for demo facilitation

* Scenario 2 is the recommended end-to-end storytelling path for a phased workflow.
* Scenario 6 remains in source data and KPI logic but is intentionally hidden from queue display.
* Warning scenarios are best used to demonstrate proactive intervention before SLA breach.
