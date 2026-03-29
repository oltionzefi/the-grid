# 🍔 The Grid

> A cross-platform desktop burger ordering app built with Electron + React.

Browse the menu, build a custom burger, check delivery locations on an interactive map, manage your account, and place an order — all from a native desktop experience with full dark mode support.

---

## Features

- **Burger Menu** — Browse, search, and filter burgers by category. Customise toppings and add to cart.
- **Custom Builder** — Step-by-step visual burger assembly: choose bun, patty, and toppings.
- **Delivery Locations** — Interactive Leaflet map showing all pickup points.
- **Recipes** — Expandable recipe cards with ingredients and steps.
- **Account & Loyalty** — View loyalty card and personal details.
- **Settings** — Appearance (light/dark/system), location access toggle, preferred pickup.
- **FAQ** — Accordion-style help section.
- **Admin Panel** — PIN-gated panel (`1234`) for managing menu, locations, builder ingredients, and store branding.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop Runtime | Electron 35 |
| UI Framework | React 19 |
| Build Tool | Vite 6 |
| Language | TypeScript 5 (strict) |
| State Management | Zustand 5 (persisted, version 3) |
| UI Components | HeroUI v3 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Dark Mode | next-themes |
| Routing | React Router 7 |
| Maps | Leaflet 1.9 + react-leaflet 5 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Development

```bash
npm run dev        # Electron + Vite dev server with hot reload
npm run debug      # Dev with React DevTools enabled
```

### Build

```bash
npm run build      # tsc → Vite build → electron-builder
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Electron dev server |
| `npm run build` | Production build |
| `npm run test` | Run unit tests (Vitest, exits on completion) |
| `npm run test:coverage` | Run tests with v8 coverage report |
| `npm run e2e:cucumber` | Run Cucumber BDD E2E tests |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format:fix` | Prettier auto-format |

---

## App Routes

| Path | Description |
|---|---|
| `/` | Burger menu — browse, search, filter, order |
| `/build` | Custom burger builder |
| `/location` | Delivery map |
| `/recipe` | Recipe cards |
| `/settings` | Preferences |
| `/account` | Loyalty card & account info |
| `/faq` | Help & FAQ |
| `/terms` | Terms & Conditions |
| `/admin` | Admin panel (PIN: `1234`) |

---

## Project Structure

```
src/
├── components/       # Shared UI (nav, cart drawer, dropdown)
├── modules/          # Feature pages (burger, build, location, recipe…)
├── state/            # Zustand store (cart, prefs, admin data)
├── assets/           # Static assets (images)
└── commands/         # Electron IPC listeners

electron/
├── main/             # BrowserWindow + auto-updater
└── preload/          # contextBridge IPC + loading screen

e2e/                  # Cucumber BDD scenarios + Playwright
```

---

## License

MIT © [Oltion Zefi](https://github.com/oltionzefi)
