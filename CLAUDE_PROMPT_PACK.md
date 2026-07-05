# Claude Code prompt pack for this dual war + survival Unreal game

Use this as a reusable prompt for Claude Code when working on this project.

## Core mission
Build a first-person experience that blends military combat with survival pressure in a coherent, playable Unreal Engine project.

## Design priorities
- Keep combat and survival systems modular and easy to balance.
- Make military FPS gameplay feel responsive, readable, and credible.
- Make survival gameplay feel meaningful through resource pressure, progression, environmental hazards, and scavenging.
- Make base-building and scavenging feel essential to survival and mission success.
- Make squad tactics matter through coordination, positioning, and team-based decisions.
- Make survival systems reinforce the war experience by creating tension, scarcity, and meaningful choices during missions and exploration.
- Support game store integration for purchases, bundles, and progression-related content.
- Use cryptocurrency as the in-game currency in a way that feels secure, readable, and appropriate for the economy.
- Balance realism and playability so the game feels authentic without becoming overly punishing or opaque.

## Engineering guidance
- Prefer small, compile-safe changes over large rewrites.
- Follow Unreal naming and organization conventions.
- Keep C++ and Blueprint responsibilities clearly separated unless the feature truly needs both.
- Use Unreal reflection macros correctly, including UCLASS, USTRUCT, UPROPERTY, and UFUNCTION where appropriate.
- Avoid hardcoded values when a config asset, Data Asset, or Project Settings entry would be more appropriate.
- Prefer root-cause fixes over speculative patches.
- Preserve engine compatibility and avoid unsupported APIs.

## Combat guidance
- Keep player movement, camera control, weapon logic, interaction logic, combat state, equipment, and UI clearly separated.
- Use input mappings and action bindings consistently for aiming, firing, reloading, sprinting, crouching, prone movement, and interacting.
- Favor believable systems and readable state transitions for military simulation and milsim-style play.
- For arcade military shooter and tactical operator style work, prioritize responsiveness, clarity, and satisfying feedback.
- Support squad tactics through team coordination, positional play, and mission-focused decision-making.
- If a feature affects weapon behavior, visibility, collision, recoil, spread, or camera response, validate it carefully in the editor.

## Survival guidance
- Keep hunger, thirst, health, fatigue, shelter, weather, and resource management as modular systems.
- Keep survival systems separate from combat systems where possible so they can be tuned independently.
- Use data-driven values for item durability, crafting recipes, resource depletion, and environmental effects.
- Favor clear progression and readable feedback for survival loops such as gathering, crafting, healing, base management, and scavenging.
- Make base-building and scavenging feel essential to survival and mission success.

## Economy and storefront guidance
- Keep game store integration modular, secure, and easy to audit.
- Support purchases, bundles, and progression-related content through a clear storefront flow.
- Treat cryptocurrency-based in-game currency as a first-class economy system with validation, balance, and security in mind.
- Keep wallet, transaction, and reward logic separated from gameplay systems so they can be tested independently.
- Favor clear player-facing feedback for purchases, rewards, and currency changes.

## Validation workflow
1. Compile the relevant code.
2. Test the feature in the editor.
3. Check for packaging or plugin regressions.
4. Summarize any limitations or follow-up work.

## Example prompts
- Implement this combat-heavy survival gameplay feature in C++ with Blueprint-friendly exposure.
- Add a base-building or scavenging system using Unreal-friendly patterns.
- Refactor this combat, squad, or survival subsystem to be more modular and easier to test.
- Add game store integration for a purchase flow, bundle system, or progression reward.
- Add cryptocurrency-based in-game currency support with secure and auditable logic.
- Build a wallet, transaction, or token-reward flow that fits the in-game economy.
- Fix this Unreal compile error and explain the cause.
- Add a reusable interaction, equipment, squad, economy, or world-resource component following Unreal conventions.
