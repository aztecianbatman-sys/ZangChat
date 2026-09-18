# 2026-09-18 — Preload build fix

## Developer notes

The development build was failing because electron-vite could not discover the preload entry point. ZangChat keeps its preload at `src/main/preload.ts`, so the Electron Vite configuration now supplies that file explicitly as the preload Rollup input.

The project also now exposes `npm start` as an alias for the development command.

## Expected result

`npm run dev` and `npm start` should both build the main process, build the preload bundle, and launch the Electron window.
