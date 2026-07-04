# Gator Coin token subsystem

Gator Coin (`GATOR`) is a fixed-supply fungible token on Solana, built with the
stock SPL Token program and Metaplex Token Metadata program -- no custom
on-chain program is used.

## Tokenomics

| Parameter | Value |
|---|---|
| Name | Gator Coin |
| Symbol | GATOR |
| Decimals | 6 |
| Total supply | 1,000,000,000 (fixed, minted once) |
| Freeze authority | None |
| Mint authority | Revoked after initial mint -- see below |

## One-time setup

```
cp .env.example .env   # already done in this repo; edit if you need to change anything
npm install
```

`.env` controls the cluster (`devnet` by default) and tokenomics parameters.
`TOKEN_TOTAL_SUPPLY=REPLACE_ME`-style placeholders must be filled in before
running `token:create` -- this repo's `.env` already has real values.

## Creating the token (once per cluster)

```
npm run token:airdrop           # fund the payer wallet with devnet SOL
npm run token:create            # creates the mint, mints the fixed supply, attaches metadata
npm run token:info              # verify decimals/supply/metadata look correct
```

`token:create` is idempotent-guarded: it refuses to run again if a deployment
record already exists for the current cluster, or if the mint address already
has supply on-chain.

**Mint authority is left active after `token:create`.** Only after verifying
`token:info` looks correct, run:

```
npm run token:revoke-mint-authority
```

This is irreversible -- it permanently fixes the supply at 1,000,000,000 GATOR.

## Everyday scripts

- `npm run token:info` -- print mint + metadata state.
- `npm run token:balance -- [ownerPubkey]` -- balance for any wallet (defaults to treasury).
- `npm run token:transfer -- <fromKeypairPath> <toPubkey> <amount>` -- move GATOR (amount in human units, e.g. `1.5`).
- `npm run token:new-wallet -- [label]` -- generate a throwaway devnet wallet for testing.
- `npm run token:airdrop -- [pubkey] [solAmount]` -- devnet-only SOL faucet wrapper.

## Key management

- The **payer** wallet is your existing Solana CLI keypair (`~/.config/solana/id.json`)
  -- it just pays transaction/rent fees.
- The **treasury / mint authority** keypair lives at `token/keys/treasury-keypair.json`,
  generated on first use. It also acts as the metadata update authority.
- All of `token/keys/*.json` is gitignored. **Back up `treasury-keypair.json`** --
  losing it means losing control of the treasury and (until revoked) mint authority.
- These are plaintext local keys, acceptable **only for devnet**. Before any
  mainnet use, treasury/mint/update authority must move to a hardware wallet or
  multisig (e.g. Squads) -- not implemented here.

## Deployment record

`token/deployments/<cluster>.json` is the source of truth for the mint address,
treasury pubkey, and transaction signatures for that cluster. It's committed to
git (it's all public on-chain info) so every script reads the mint address from
one place instead of re-entering it.

## Deliberately out of scope for this milestone

- Game/network integration (no game code exists yet to integrate with).
- Purchase/storefront flow.
- Mainnet deployment.
- Browser wallet-adapter UI.
- Permanent metadata storage (Arweave/IPFS) -- the metadata image/JSON is served
  via GitHub raw URLs for now, which is a devnet-only shortcut.
- Legal/regulatory review -- get qualified legal counsel before any public
  distribution, sale, or mainnet launch of a token with real-world value.
