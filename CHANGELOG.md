# Changelog

## 2026-09-05

### Features

- Introduced Cross PC AI, a desktop chat experience for Claude with conversation history, settings, memory controls, optional cross-device sync, and a guided setup flow.
- Added Windows and Linux installer builds, application branding, and development-container support.
- Added optional Supabase-backed account, subscription, and synchronization infrastructure.
- Added hourly commit summaries powered by Claude, with setup instructions for repository maintainers.

### Bug Fixes

- Fixed application startup failures by making the Electron preload bridge compatible with sandboxed windows.
- Restored Tailwind styling and custom branding by correcting the renderer configuration.
- Corrected Claude thinking settings and shared TypeScript configuration so the app builds and type-checks successfully.
- Updated Electron and image-processing dependencies to address known security vulnerabilities.
- Prevented automated commit summaries from failing when required repository secrets are unavailable.

### Chores

- Removed files and dependencies left over from the original haiku web application.
- Added linting, type-checking, packaging, and installer-generation configuration for the desktop app.

### Breaking Changes

- Replaced the original browser-based haiku application with the Cross PC AI Electron desktop application. Existing web-server deployment commands and Azure web-app configuration are no longer supported.
