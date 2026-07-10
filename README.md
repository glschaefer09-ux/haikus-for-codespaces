# CCDE Business Suite

CCDE Business Suite is a modular Node.js dashboard for the operating model described in the architecture brief: **One Dashboard. Every Venture.**

## What is included

- **POS Revenue Dashboard** with Square, Toast, and Lightspeed revenue rollups
- **Token Intelligence** with ChefCoin contract metrics across all 8 contracts
- **Integrations Hub** for CSBL bridge, Kafka topics, POS webhooks, and Drive health
- **Nonprofit ↔ Managing Business Relay** reporting overview
- **Google Workspace Hub** with a swappable `DocumentStoragePort`
- **CCDE Command Center** for projects, service health, and workflow status
- Production-oriented **request logging**, **error handling**, **automation workflows**, and **JSON APIs**

## Runtime

```bash
npm install
npm start
```

The app starts on `PORT` or `3000` by default.

## Test

```bash
npm test
```

## Google Drive configuration

Google Drive is implemented through a pluggable storage adapter:

- `GoogleDriveStorage` uses the Google Drive API v3
- `MemoryDocumentStorage` is the safe fallback when credentials are absent

Supported environment variables:

- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_DRIVE_FOLDER_ID`
- `GOOGLE_IMPERSONATED_USER`
- `LOG_LEVEL`
- `PORT`

If no Google credentials are provided, the dashboard still works and clearly reports that it is using in-memory storage.

If you set `GOOGLE_IMPERSONATED_USER`, the service account must already be configured for Google Workspace domain-wide delegation with the listed Drive scopes, or Drive API calls will fail.

## HTTP endpoints

- `GET /` — server-rendered operational dashboard
- `GET /api/health` — health probe
- `GET /api/dashboard` — suite snapshot
- `GET /api/drive/files` — workspace file listing + storage health
- `POST /api/drive/reports` — upload a report `{ "name": "...", "content": "..." }`
- `POST /api/workflows/daily-summary` — run the daily summary automation workflow

## Notes

This repository originally started as a minimal Codespaces haiku demo. It has been expanded into a structured dashboard application while keeping the deployment model lightweight and compatible with the current Express runtime.

For dependency hardening, `package.json` pins `picomatch` through `overrides` so the development watcher stack uses the patched release required to clear the current npm audit findings.
