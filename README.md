
# Gator Coin

Gator Coin (`GATOR`) is a fixed-supply Solana SPL token that will serve as the
community currency for **Gator Clans**, a nonprofit gaming community, usable
for purchases in-game (merch, skins, etc.) and across the future Gator Clans
Network.

- **Chain:** Solana, using the stock SPL Token program + Metaplex Token
  Metadata program (no custom on-chain program).
- **Supply:** 1,000,000,000 GATOR, minted once, mint authority then revoked.
- **Current stage:** devnet only. See [`token/README.md`](token/README.md)
  for tokenomics, setup, and script usage.

This repo also serves a minimal read-only Express/EJS dashboard
(`npm start`) showing the mint's on-chain state and letting anyone look up a
wallet's GATOR balance.

## Quick start

```
npm install
cp .env.example .env   # edit if needed -- defaults target devnet
npm run token:airdrop
npm run token:create
npm run token:info
npm start
```

## Scope note

Neither the Gator Clans game nor the wider Gator Clans Network exist as code
yet, so this repo intentionally stops at the token itself and the tooling a
future game backend would build on -- no purchase flow, no game integration,
no mainnet deployment. See "Deliberately out of scope" in
[`token/README.md`](token/README.md).
