# Unreal Engine guidance for Claude Code

Use this file as a working instruction set when helping with a dual war-and-survival first-person Unreal Engine game project.

## Primary goals
- Help implement the game’s military combat systems, survival systems, tooling, and engine-facing code safely.
- Prefer small, compile-safe changes over large rewrites.
- Keep the project maintainable and aligned with Unreal conventions.

## Recommended toolchain
- Unreal Engine 5.x
- Visual Studio 2022 with the C++ desktop workload
- Git and Git LFS
- Unreal Build Tool for compilation and packaging
- Optional: Rider, RenderDoc, or a debugger for deeper issues

## Working rules
- Follow Unreal naming and organization conventions.
- Prefer C++ for gameplay logic when it needs performance, reuse, or strong type safety.
- Keep Blueprint and C++ responsibilities separate unless the feature truly requires both.
- Use Unreal reflection macros correctly, including UCLASS, USTRUCT, UPROPERTY, and UFUNCTION where appropriate.
- Avoid hardcoded values when a config asset, Data Asset, or Project Settings entry would be more appropriate.
- For military FPS features, consider whether the best home is the character controller, player camera manager, weapon component, interaction component, combat state component, equipment manager, or a data-driven asset.
- Keep aiming, recoil, weapon handling, movement discipline, stamina, reload flow, and combat state logic modular and responsive.
- Preserve engine compatibility and avoid unsupported APIs.
- When uncertain, explain assumptions clearly rather than guessing.

## Style guidance
- For this game, combine combat-heavy survival with base-building, scavenging, and squad tactics.
- For military simulation and immersive realism / milsim: prioritize believable movement, equipment behavior, reload flow, ballistics, and readable combat state.
- For arcade military shooter and modern tactical operator style: prioritize responsive controls, clear feedback, quick readability, and satisfying weapon handling while keeping systems understandable.
- Balance realism and playability so the game feels authentic without becoming overly punishing or opaque.

## Military FPS guidance
- Treat camera control, movement, and input handling as core gameplay systems that should stay modular.
- Keep weapon, ammo, reload, damage, and equipment systems separate from movement and camera code when possible.
- Use input mappings and action bindings consistently for aiming, firing, reloading, crouching, sprinting, prone movement, and interacting.
- Favor realistic, readable combat behavior over arcade-style simplifications unless the design explicitly calls for them.
- Avoid putting combat state in UI code; keep shared state in gameplay components or actors.
- If a feature affects weapon behavior, visibility, collision, recoil, spread, or camera response, validate it carefully in the editor.
- Prefer data-driven weapon parameters and clear simulation rules for ballistics, handling, and reload timing.

## Survival game guidance
- Treat hunger, thirst, health, fatigue, shelter, weather, and resource management as systems that should remain modular and testable.
- Keep survival systems separate from combat systems where possible so they can be tuned independently.
- Use data-driven values for item durability, crafting recipes, resource depletion, and environmental effects.
- Favor clear progression and readable feedback for survival loops such as gathering, crafting, healing, base management, and scavenging runs.
- If a feature affects world interaction, inventory flow, crafting, or environmental simulation, validate it carefully in the editor.
- Make survival systems reinforce the war experience by creating pressure, scarcity, and meaningful choices during missions, exploration, and base defense.

## Debugging and validation
- Reproduce the problem before changing code.
- Prefer root-cause fixes over speculative patches.
- After significant changes, validate by compiling in Visual Studio or via the Unreal build system.
- Test the change in the editor and call out any packaging or plugin impact.

## Good task patterns
- Implement realistic movement, interaction, equipment, or weapon systems in C++ with Blueprint exposure when needed.
- Add survival systems such as resource gathering, crafting, inventory, health states, and environmental hazards.
- Build systems that connect combat and survival, such as scavenging during missions, equipment wear, base construction, or survival pressure during operations.
- Support squad tactics through team coordination, AI behavior, command-style interactions, and mission structure.
- Add game store integration for purchases, bundles, or progression-related content.
- Support cryptocurrency-based in-game currency flows, wallets, transactions, and economy-safe validation.
- Fix compile errors and explain the likely root cause.
- Refactor combat, equipment, or survival components to improve modularity and clarity.
- Add save/load, input, UI, or utility systems using Unreal-friendly patterns.
- Create editor tools or automation scripts when they improve workflow.

## Example prompt style
Use prompts such as:
- Implement this military FPS gameplay feature in C++ with Blueprint-friendly exposure.
- Fix this Unreal compile error and explain the cause.
- Refactor this combat or weapon subsystem to be more modular and easier to test.
- Add a reusable interaction, equipment, or weapon component following Unreal conventions.
