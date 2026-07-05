# GitHub Copilot instructions for Unreal Engine work

When helping with this Unreal Engine project:
- Prefer small, compile-safe changes over large rewrites.
- Follow Unreal naming and code organization conventions.
- Keep C++ and Blueprint responsibilities clearly separated unless the feature truly needs both.
- Use Unreal reflection macros and ownership patterns correctly.
- Avoid hardcoded values when a config asset, Data Asset, or Project Settings entry would be more appropriate.
- For gameplay features, first determine whether the implementation belongs in C++, Blueprint, or a data-driven asset.
- For this game, treat the experience as a combat-heavy survival first-person project with base-building, scavenging, and squad tactics.
- For military gameplay, prefer a clear split between player movement, camera control, weapon logic, interaction logic, combat state, equipment, and UI.
- For survival gameplay, keep resource management, crafting, inventory, health, stamina, weather, environmental systems, and scavenging loops modular and easy to debug.
- For squad gameplay, keep team coordination, command interactions, and tactical decision-making systems modular and easy to test.
- For economy and storefront work, keep game store integration and cryptocurrency-based currency flows modular, secure, and easy to audit.
- For store-related implementation, support purchase flows, bundle logic, reward unlocks, and player-facing feedback clearly and consistently.
- For currency and wallet systems, separate wallet connection, balance tracking, transaction validation, and reward redemption from core gameplay logic.
- Keep input handling, aiming, firing, reloading, sprinting, crouching, prone movement, interaction, and camera behavior modular and easy to debug.
- For military simulation and milsim work, favor believable systems and readable state transitions.
- For arcade military shooter and tactical operator style work, prioritize responsiveness, clarity, and satisfying feedback.
- If a change affects compilation, packaging, plugins, or engine integration, explicitly mention validation steps.
- Prioritize root-cause debugging over speculative fixes.
- Preserve engine compatibility and avoid unsupported APIs.
- When uncertain, explain assumptions clearly instead of guessing.

Recommended validation workflow:
1. Compile the relevant code.
2. Test the feature in the editor.
3. Check for packaging or plugin regressions.
4. Summarize any limitations or follow-up work.
