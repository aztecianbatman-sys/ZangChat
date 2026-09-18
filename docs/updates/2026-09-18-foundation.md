# Foundation update — 2026-09-18

## Feature notes

- Built the ObsidianUI v1 Electron desktop frame.
- Added authenticated profiles, channels, messages, and presence.
- Added email/password account creation and sign-in.
- Added Realtime message/presence subscriptions.
- Added rich renderers for text, game-lobby, and media messages.
- Added the Nexus Toolkit surface.
- Added a proximity presence canvas with floating user markers.

## Developer notes

- Electron is pinned to 37.2.6.
- Renderer Node integration is disabled and communication uses contextBridge.
- Supabase uses the publishable key.
- All four public tables have RLS enabled.
- Anonymous access to application tables is revoked.
- The profile creation trigger uses SECURITY DEFINER for Auth-triggered profile creation, while direct EXECUTE privileges for public, anon, and authenticated were revoked.
- Table grants were tightened so authenticated clients only receive the database privileges used by the current IPC surface.
- Persisted Realtime currently uses Postgres Changes.

## Verification

The Supabase project is active and healthy. The security advisor returned no findings after the trigger/grant hardening.

## Known gaps

GitHub/Twitch APIs, media Storage uploads, channel membership, and safe code execution are not falsely represented as complete.
