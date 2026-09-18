# Foundation update — 2026-09-18

## Feature notes

- Built the ObsidianUI v1 Electron desktop frame.
- Added authenticated profiles, channels, messages, and presence.
- Added email/password account creation and sign-in.
- Added Realtime message/presence subscriptions.
- Added rich renderers for text, code, game-lobby, and media messages.
- Added the Nexus Toolkit surface.

## Developer notes

- Electron is pinned to 37.2.6.
- Renderer Node integration is disabled and communication uses contextBridge.
- Supabase uses the publishable key.
- All four public tables have RLS enabled.
- Anonymous access to application tables is revoked.
- The profile creation trigger's direct EXECUTE privileges were revoked after the security advisor check.
- Persisted Realtime currently uses Postgres Changes.

## Known gaps

GitHub/Twitch APIs, media Storage uploads, channel membership, and safe code execution are not falsely represented as complete.
