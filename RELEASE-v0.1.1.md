# ZangChat v0.1.1

Windows desktop release prepared from the corrected ObsidianUI v1 foundation.

## Included

- Windows x64 NSIS installer
- Windows x64 portable executable
- Production Electron renderer without a localhost dependency
- Supabase authentication, database, RLS, and Realtime foundation

## Fixes

- Electron main entry now matches electron-vite output
- Preload path now matches the generated preload bundle
- Production renderer uses Electron loadFile()
- npm start performs a production build and launches Electron
- Windows packaging is handled by electron-builder
