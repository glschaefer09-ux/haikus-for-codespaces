# Economy and storefront implementation checklist

## Storefront
- Define purchase flows for items, bundles, and progression rewards.
- Separate storefront UI from economy logic.
- Provide clear success, failure, and pending states for purchases.
- Support bundle logic, unlock conditions, and reward application.
- Ensure purchase events are logged and auditable.

## Currency and wallet
- Separate wallet connection, balance tracking, transaction validation, and reward redemption.
- Keep currency state updates atomic and easy to test.
- Provide clear player feedback for balance changes, failures, and confirmations.
- Validate transaction safety and prevent double-spend or inconsistent state.
- Keep currency and wallet logic modular so gameplay systems do not directly manage them.

## Crypto and rewards
- Support cryptocurrency-based in-game currency with explicit validation rules.
- Keep reward claims, redemption, and spending flows predictable.
- Make reward unlocks and purchases visible in the UI.
- Ensure economy updates are consistent between client, server, and any external service.

## Implementation guidance
- Prefer small, testable systems over a single large economy module.
- Use data-driven configuration for pricing, rewards, bundles, and conversion rules.
- Validate changes in editor and in build/test flows before shipping.
