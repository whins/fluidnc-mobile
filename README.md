# FluidNC Mobile

A mobile-first PWA for controlling FluidNC laser machines from your phone.

## Features

- **Control tab** — Jog (X/Y, steps: 0.1/1/10/100mm), Home axes, Feedrate & Laser power overrides
- **Files tab** — Browse SD card files, upload .nc/.gcode, run jobs with live progress
- **Settings tab** — Controller IP, dark/light theme, EN/UK language
- **PWA** — installable on iOS/Android homescreen
- **Real-time status** — WebSocket connection to FluidNC for live machine state

## Tech Stack

- [Nuxt 3](https://nuxt.com) + [Nuxt UI](https://ui.nuxt.com)
- [@vueuse/core](https://vueuse.org) — `useWebSocket`, `useLocalStorage`
- [@nuxtjs/i18n](https://i18n.nuxtjs.org) — English / Ukrainian
- [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt) — PWA support
- Deployed on [Vercel](https://vercel.com) as a static SPA

## FluidNC API

| Action                                 | Method                                        |
| -------------------------------------- | --------------------------------------------- |
| Send command (`$J=`, `$H`, `$SD/Run=`) | `GET /command?plain=CMD`                      |
| Realtime (`!` hold, `~` resume)        | `GET /command?plain=!`                        |
| List SD files                          | `GET /upload?path=/`                          |
| Upload to SD                           | `POST /upload`                                |
| Delete from SD                         | `GET /upload?path=/&filename=X&action=delete` |
| Status stream                          | WebSocket `ws://[IP]:81`                      |

## Setup

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
# Static generation for Vercel
npm run generate

# Or let Vercel auto-detect Nuxt
```

Set `NUXT_PUBLIC_DEFAULT_IP` env var on Vercel to pre-fill the controller IP (optional).

## PWA Icons

Placeholder icons are in `public/icons/`. Replace with real icons before publishing:

- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

## License

MIT
