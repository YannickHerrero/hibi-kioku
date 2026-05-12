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

## Routes

| Route          | Purpose                                                         |
| -------------- | --------------------------------------------------------------- |
| `/`            | Landing — due-card count + jump-to-review                       |
| `/review`      | Daily review session (1/2/3/4 to rate, space to reveal)         |
| `/library`     | Browse cards (search `?q=`, tag chips, sort, infinite scroll)   |
| `/library/:id` | Card detail (focus word, kanji, audio, image, tags)             |
| `/stats`       | Yearly heatmap, retention, daily counts                         |
| `/settings`    | Theme picker (5 Torakaa variants), API key paste/clear          |

## Keyboard shortcuts (Review)

| Key             | Action          |
| --------------- | --------------- |
| `space`         | Reveal answer   |
| `1`             | Again (lapse)   |
| `2`             | Hard            |
| `3`             | Good            |
| `4`             | Easy            |

## Deploying to Vercel

`vercel.json` sets up SPA rewrites so deep links work. The bundle is a static site, no edge functions needed. The published `hibi-client@^0.4.0` is fetched from npm at install time, so no monorepo linkage is required.

## Conventions

See [`CLAUDE.md`](./CLAUDE.md) for stack details, layout, and contribution conventions.
