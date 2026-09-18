# 2026-09-18 — Supabase key wiring

## Feature notes

ZangChat now has the project's Supabase URL and publishable key wired into the Electron main-process client.

## Developer notes

- Environment variables still take precedence when present.
- The bundled fallback is the Supabase **publishable** key only.
- No service-role or secret key was added.
- This keeps the development build runnable without requiring a local `.env` file.

## Security note

The publishable key is not a database bypass. ZangChat continues to rely on Supabase Auth and the RLS policies applied to the application tables.
