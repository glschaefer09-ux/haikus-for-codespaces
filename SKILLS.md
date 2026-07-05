# Skills and input protocol for this Unreal Engine game

## Purpose
This document defines practical skills and input conventions for working on this dual war-and-survival first-person Unreal Engine game using Claude Code or similar assistants.

## Core Unreal Engine skills
- Unreal C++ development
  - Actors, Components, UObjects, UPROPERTY, UFUNCTION, delegates, gameplay framework
- Blueprint awareness
  - Understand when logic should live in C++ versus Blueprint
- Build and packaging knowledge
  - Fix compile errors, module issues, and packaging failures
- Gameplay architecture
  - Character movement, camera systems, weapons, interaction, inventory, survival loops, and UI
- Tooling and automation
  - Editor utilities, data import workflows, scripting, and asset pipeline helpers
- Debugging discipline
  - Reproduce issues, isolate root causes, and validate fixes

## Survival + combat skill blend
- Keep combat and survival systems modular and independently tunable.
- Separate movement, camera, weapons, inventory, crafting, health, stamina, environmental systems, squad coordination, and economy flows.
- Prefer data-driven configuration for balance and tuning.
- Design systems so combat, survival, base-building, scavenging, squad tactics, and store/economy integration reinforce one another rather than competing for attention.
- Support game store integration and cryptocurrency-based in-game currency with secure, auditable, and player-friendly patterns.

## Economy and storefront skills
- Implement storefront flows for purchases, bundles, and progression rewards.
- Add wallet handling, transaction validation, and currency balance logic.
- Build token-based reward and spend systems that fit a game economy.
- Keep economy systems modular so they can be tested independently from gameplay loops.

## Input protocol for language and code requests
Use this structure when giving instructions:

1. Goal
   - State the feature or fix you want.
2. Context
   - Mention the relevant subsystem, class, or module.
3. Constraints
   - Note engine version, style, performance needs, or compatibility limits.
4. Desired output
   - Specify whether you want C++ code, Blueprint guidance, refactoring, or debugging help.
5. Validation
   - Ask for compilation, editor testing, or packaging checks when relevant.

## Recommended prompt template
Use prompts like this:

```text
Goal: Implement a new first-person interaction system.
Context: Unreal Engine 5 project, player character, interaction component, C++.
Constraints: Must remain Blueprint-friendly, compile-safe, and modular.
Desired output: Provide C++ implementation and explain where it should be wired.
Validation: Include compile and editor verification steps.
```

## Good task categories
- Implement gameplay systems
- Fix compile errors
- Refactor subsystems
- Add save/load or inventory systems
- Create editor tools or automation
- Improve modularity and testability

## Preferred response style
- Prefer concise explanations and direct implementation guidance.
- When uncertain, state assumptions clearly.
- Highlight likely build or packaging impact.
- Keep changes small and targeted unless a larger refactor is explicitly requested.
