---
title: Business Requirements Addendum - UI Theme and Assistant Launcher
description: Addendum to the BRD capturing the Microsoft-style visual refresh and floating assistant launcher behavior for the command-center prototype
author: Onboarding Command Center Team
ms.date: 2026-07-22
ms.topic: concept
keywords:
  - onboarding
  - command center
  - prototype
  - ui theme
  - assistant launcher
estimated_reading_time: 2
---

## Scope Update Summary

This addendum updates the approved business requirements for the prototype experience.

* Visual direction is now Microsoft-style with a white and blue first palette.
* The assistant entry point is now a floating launcher icon at the bottom-right of the viewport.
* Selecting the launcher expands a right-side floating assistant chat panel.
* The dashboard now renders eight KPI cards and each KPI card includes a visible status label.

## Functional Requirement Update

* The assistant must remain available from a persistent bottom-right launcher control.
* The launcher must support expand and collapse behavior through a single click action.
* The expanded assistant panel must not navigate away from the command-center workspace.
* The expanded assistant panel must preserve accessibility semantics with a clear accessible label and visible focus treatment.
* The expanded assistant panel must provide both contextual summary content and interactive chat input.

## Layout and Interaction Update

* The primary command-center content now uses a full-width layout without a permanently docked right-side assistant column.
* The assistant experience appears as a floating overlay panel when opened from the launcher.
* The closed state must keep only the launcher visible in the bottom-right corner.
* The header title for screenshots is `New Hire Onboarding Command Center`.
* The `Prototype - Synthetic data` chip is removed from the screenshot layout.

## Visual Requirement Update

* The page background, cards, and controls use a white and blue dominant palette.
* Contrast and state indicators remain compliant with existing accessibility requirements.
* Severity indicators still use text labels and not color alone.
* KPI cards show explicit text status states (`On track`, `Watch closely`, `Critical risk`) and not color-only signaling.

## Traceability Note

This addendum should be read alongside:

* docs/requirements/business-requirements.docx
* docs/requirements/build-specification.md
