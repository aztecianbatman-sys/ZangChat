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
- electron-builder for Windows packaging

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

## Run locally

For development with the Vite dev server:

```bat
npm install
npm run dev
```

For a production-style Electron launch with the renderer loaded from the built files instead of localhost:

```bat
npm start
```

For a Windows installer + portable executable:

```bat
npm install
npm run package:win
```

Artifacts are written to `release/`.

## Architecture

The Electron main process owns the Supabase client and exposes a narrow API through contextBridge. The renderer has nodeIntegration disabled and does not receive arbitrary ipcRenderer access.

Database operations are explicit IPC handlers; arbitrary SQL is never exposed to the renderer.

The production app uses `loadFile()` for the bundled renderer. The dev server URL is only used when electron-vite explicitly provides `ELECTRON_RENDERER_URL`.

## Windows releases

GitHub Actions builds the Windows installer and portable executable from version tags such as `v0.1.1`.

The release workflow:

1. installs dependencies,
2. typechecks,
3. builds Electron main/preload/renderer bundles,
4. packages Windows x64 artifacts,
5. publishes tagged artifacts to the GitHub release.

## Update notes

### 2026-09-18 — Windows packaging + startup fix

**Feature notes**
- Added production Electron startup without localhost.
- Added Windows x64 NSIS installer target.
- Added Windows x64 portable executable target.
- Added `npm start` for production-style local launching.
- Added GitHub Actions release pipeline.

**Developer notes**
- Electron main entry now matches electron-vite output at `out/main/index.js`.
- Preload path now matches the generated `out/preload/preload.js`.
- Production renderer loads with Electron's `loadFile()`.
- npm install-script approvals are declared for Electron and esbuild.

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

See `docs/updates/` for the detailed update records.
