# Cross PC AI

Chat with Claude, and pick up the same conversation on any of your PCs.

Cross PC AI is a desktop app (Windows + Linux) built with Electron, React, and
TypeScript. You bring your own Anthropic API key — chats are stored locally on
your device by default, no account required. Turning on **Cross PC Sync**
($15/mo, optional) mirrors your conversations to the cloud so a chat started
on one PC keeps going on another, in near real time.

## Quick start (from source)

```
npm install
npm run dev
```

The first launch walks you through a short setup wizard: paste an Anthropic
API key (get one at [console.anthropic.com](https://console.anthropic.com/settings/keys)),
and you're chatting. No `.env` file to edit.

## Building installers

```
npm run build:win     # -> release/Cross PC AI-Setup-<version>.exe
npm run build:linux   # -> release/Cross PC AI-<version>.AppImage and .deb
```

Both produce a signed app icon, a Start Menu / Desktop shortcut (Windows) or
a registered `.desktop` entry (Linux `.deb`), and an uninstaller. Builds are
unsigned in this repo (no code-signing certificate configured), so Windows
SmartScreen will show an "unknown publisher" warning on first run — expected
for now, not a bug.

Tagging a release (`git tag v0.1.0 && git push --tags`) triggers
[`.github/workflows/build-installers.yml`](.github/workflows/build-installers.yml),
which builds both installers on native runners and attaches them to a draft
GitHub Release.

## Architecture

- **Client:** Electron + React + TypeScript + Tailwind, scaffolded with
  `electron-vite`. Anthropic API calls happen in the main process only — your
  key is encrypted at rest via the OS credential store (Windows DPAPI / Linux
  libsecret via `safeStorage`) and never enters the renderer's JS context.
- **Local storage:** conversations are saved to a JSON file in the app's
  per-OS user data directory (`src/main/localStore.ts`). This is what powers
  chat when Cross PC Sync isn't enabled.
- **Cross PC Sync (optional, $15/mo):** a Supabase project (Postgres + Auth +
  Realtime) plus two Stripe-backed Edge Functions
  (`supabase/functions/create-checkout-session`,
  `supabase/functions/stripe-webhook`) gate access behind an active
  subscription via Row Level Security — see
  [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
  This part of the app is scaffolded but **not connected** in this repo yet:
  it needs a real Supabase project and Stripe account. See
  [Connecting Cross PC Sync](#connecting-cross-pc-sync) below.
- **Branding:** the app mark is a single hand-authored SVG
  (`branding/logo-mark.svg`); `npm run icons:generate` rasterizes it to the
  full icon set installers need (`scripts/generate-icons.mjs`, via `sharp` +
  `png-to-ico`).

## Connecting Cross PC Sync

This repo ships the sync architecture, not live credentials — you'll need
your own Supabase project and Stripe account:

1. Create a Supabase project and apply
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
2. Deploy the two functions in `supabase/functions/`, and set their secrets
   (`STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`,
   `SUPABASE_SERVICE_ROLE_KEY`) in the Supabase dashboard.
3. Create a $15/month recurring Price in Stripe and point a webhook at the
   `stripe-webhook` function URL.
4. Copy `.env.example` to `.env`, fill in `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (safe to be public — access is enforced by RLS,
   not secrecy), and rebuild.

Until that's done, the Settings screen shows Cross PC Sync as "not connected
yet" and the app works fully as a local, single-device client.

## Notes

- The dev container (`.devcontainer/`) is for editing/typechecking only — it
  has no display server, so the Electron GUI can't run inside it. Use it for
  `npm run typecheck` / `npm run lint`; run `npm run dev` on your desktop.
- macOS builds and auto-update are not set up yet.
