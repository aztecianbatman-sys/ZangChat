# ZangChat

ZangChat is a desktop chat client built around **ObsidianUI v1**: a dense dark Electron interface that puts conversation, developer context, and game context in one window.

This is the working foundation. Features that are not connected to a real service are deliberately labeled instead of being presented as fake live data.

## Stack

- Electron 37.2.6
- TypeScript
- React 19
- Tailwind CSS v4
- Lucide React
- Supabase JS v2

## Current build

The app has a three-zone desktop frame:

- **Global Hub:** all / tech / gaming / life filters.
- **Chat:** channels, text messages, code/lobby/media message cards, presence data, and composer.
- **Nexus Toolkit:** developer and game context surfaces.

Supabase provides the real database, authentication, RLS, and Realtime layer.

## Supabase schema

- profiles
- channels
- messages
- presence

Every exposed table has RLS enabled. Anonymous table access is revoked. Messages and presence are registered with the Realtime publication.

The app uses a publishable key only. Never put a service-role or secret key in the renderer or commit one to Git.

## Local setup

1. Install Node.js.
2. Copy .env.example to .env.
3. Put the ZangChat publishable key in SUPABASE_PUBLISHABLE_KEY.
4. Run npm install.
5. Run npm run dev.

Use npm run typecheck for a TypeScript check and npm run build for a production Electron/Vite build.

## Architecture

The Electron main process owns the Supabase client and exposes a narrow API through contextBridge. The renderer has nodeIntegration disabled and does not receive arbitrary ipcRenderer access.

Database operations are explicit IPC handlers; arbitrary SQL is never exposed to the renderer.

## Update notes

### 2026-09-18 — Foundation

**Feature notes**
- ObsidianUI v1 three-zone desktop layout.
- Supabase email/password authentication.
- Profiles, channels, messages, and presence.
- Realtime channel subscriptions.
- Text/code/lobby/media message presentation.
- Proximity presence visualization.
- Nexus Toolkit UI.

**Developer notes**
- Electron pinned to 37.2.6.
- Supabase publishable key only.
- RLS enabled on all public application tables.
- Auth profile trigger hardened after the security advisor check.
- Database grants tightened to the privileges used by the app.

## Honest gaps

- GitHub and Twitch cards are UI surfaces, not live integrations yet.
- The Run Code control is intentionally not wired to arbitrary execution. A real sandbox needs a deliberate isolated execution design.
- Media Storage uploads are not implemented yet.
- Channel membership/role permissions are not implemented yet.
- No fake message history or fake online users are inserted into the database.

See docs/updates/2026-09-18-foundation.md for the update record.