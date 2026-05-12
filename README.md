# Hibi Kioku

> 記憶 — *kioku*, "memory"

Web SRS review client for the [Hibi](https://github.com/YannickHerrero/hibi) ecosystem. Review your due cards and browse your card library from any browser.

Companion to:
- [hibi-koe](https://github.com/YannickHerrero/hibi-koe) — passive-listening immersion (mobile)
- [hibi-yomi](https://github.com/YannickHerrero/hibi-yomi) — graded reader (mobile)

The mobile apps mine words from media; kioku is where you study them.

## Stack

Vite + React 19 + TypeScript · TanStack Router · TanStack Query · `hibi-client` SDK · Biome · pnpm. Deploys as a static SPA on Vercel.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck
pnpm lint
pnpm test
```

## Configuration

Environment variables (Vite reads `VITE_*` from `.env`):

| Variable             | Default                          | Description                                  |
| -------------------- | -------------------------------- | -------------------------------------------- |
| `VITE_HIBI_BASE_URL` | `https://hibi-api.vercel.app`    | Base URL of the Hibi API the app talks to.   |

Sign in by pasting a Hibi API key into Settings (generated in the [Hibi portal](https://hibi.app)). The key is stored in `localStorage`.

## Conventions

See [`CLAUDE.md`](./CLAUDE.md) for stack details, layout, and contribution conventions.
