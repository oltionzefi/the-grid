# 🍔 The Grid — Frontend

[![License](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)

Cross-platform burger-ordering app built with **React 19 + TypeScript**, delivered as an **Electron desktop app** and a **web app** from the same codebase.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [App Routes](#app-routes)
- [Scripts](#scripts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

- **Burger Menu** — Browse, search, and filter by category. Customise toppings and add to cart.
- **Custom Builder** — Visual step-by-step assembly: bun → patty → cheese → toppings → sauce.
- **Delivery Locations** — Interactive Leaflet map with all pickup points.
- **Recipes** — Expandable recipe cards with ingredients and steps.
- **Cart & Checkout** — Slide-out cart drawer; Stripe payment flow.
- **Account & Loyalty** — Loyalty card and profile view.
- **Settings** — Appearance (light/dark/system), location toggle, preferred pickup.
- **FAQ** — Accordion-style help section.
- **Terms & Conditions** — Implicit agreement; no checkbox required.
- **Admin Panel** — PIN-gated (`1234`): manage menu, locations, builder ingredients, store branding.
- **Dark Mode** — System-aware, persisted via `next-themes`.
- **Auth0** — Authentication with graceful degradation in dev (works without env vars).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop Runtime | Electron 35 |
| UI Framework | React 19 |
| Language | TypeScript 5 (strict) |
| Build Tool | Vite 6 |
| State Management | Zustand 5 (persisted to `sessionStorage`, version 3) |
| UI Components | HeroUI v3 (`@heroui/react`) |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Dark Mode | next-themes |
| Routing | React Router 7 |
| Auth | Auth0 (`@auth0/auth0-react`) |
| Payments | Stripe (`@stripe/react-stripe-js`) |
| Maps | Leaflet 1.9 + react-leaflet 5 |
| Unit Tests | Vitest 3 + Testing Library (jsdom) |
| E2E Tests | Playwright 1.51 + Cucumber BDD |
| Linting | ESLint 9 + Prettier 3 |
| Git Hooks | Husky 9 (format → lint → test on pre-commit) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install

```bash
pnpm install
```

### Development

```bash
# Web browser (no Electron)
pnpm dev

# Electron desktop app
pnpm dev:electron

# Electron with React DevTools
pnpm debug
```

### Build

```bash
# Web build
pnpm build:web

# Electron distributable
pnpm build
```

---

## Environment Variables

Copy `.env.example` to `.env`. The app works without Auth0 vars (graceful degradation — loads mock data from store).

| Variable | Description |
|---|---|
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 SPA client ID |
| `VITE_AUTH0_AUDIENCE` | JWT audience (`https://api.thegrid.io`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_…`) |
| `VITE_API_BASE_URL` | Backend base URL (default: `http://localhost:8080`) |

---

## App Routes

| Path | Description | Notes |
|---|---|---|
| `/` | Burger menu — browse, filter, order | Default page |
| `/build` | Custom burger builder | Accessed from home CTA — not in nav |
| `/location` | Delivery map | Leaflet interactive |
| `/recipe` | Recipe cards | Expand/collapse |
| `/settings` | Preferences | Theme, location, pickup |
| `/account` | Loyalty card & profile | |
| `/faq` | Help & FAQ | Accordion |
| `/terms` | Terms & Conditions | Implicit agreement |
| `/admin` | Admin panel | PIN: `1234` |

Nav links (sticky header): **Burgers · Locations · Recipes**

---

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Vite web dev server |
| `pnpm dev:electron` | Electron + Vite dev with hot reload |
| `pnpm debug` | Electron dev with React DevTools |
| `pnpm build` | tsc → Vite build → electron-builder |
| `pnpm build:web` | Web-only Vite build |
| `pnpm test` | Vitest unit tests (exits on completion) |
| `pnpm test:coverage` | Vitest with v8 coverage report |
| `pnpm e2e:cucumber` | Cucumber BDD E2E tests (requires preview server) |
| `pnpm lint:fix` | ESLint auto-fix |
| `pnpm format:fix` | Prettier auto-format |

---

## Testing

### Unit tests

```bash
pnpm test              # run all tests
pnpm test:coverage     # run with coverage report
```

- **Framework**: Vitest 3 + Testing Library
- **Coverage target**: ≥ 80% statement coverage
- Tests are co-located: `src/modules/<feature>/__test__/index.spec.tsx`
- HeroUI mocked in tests — use `vi.hoisted()` for variables used inside `vi.mock()` factories

### E2E tests (Cucumber + Playwright)

```bash
pnpm preview          # start preview server first (port 4173)
pnpm e2e:cucumber     # run 28 BDD scenarios
```

App uses `HashRouter` — E2E navigate via `/#/path` format.

---

## Project Structure

```
the-grid/
├── src/
│   ├── electron-main.tsx      # Electron entry (AuthProvider + App)
│   ├── web-main.tsx           # Web entry (AuthProvider + App)
│   ├── App.tsx                # Router + layout
│   ├── lib/
│   │   ├── api.ts             # Typed fetch client (burgers, orders, locations…)
│   │   ├── useApi.ts          # Hook injecting Auth0 token into API calls
│   │   ├── AuthProvider.tsx   # Auth0Provider with graceful dev degradation
│   │   └── useBootstrap.ts    # Loads remote data into Zustand on auth
│   ├── modules/
│   │   ├── burger/            # Burger grid + ordering
│   │   ├── build/             # Custom builder
│   │   ├── location/          # Leaflet map
│   │   ├── recipe/            # Recipe cards
│   │   ├── account/           # Loyalty card
│   │   ├── settings/          # Preferences
│   │   ├── faq/               # Help accordion
│   │   ├── terms/             # Terms page
│   │   └── admin/             # PIN-gated admin panel
│   ├── components/
│   │   ├── navigation/        # Sticky header
│   │   ├── cart-drawer/       # Slide-out cart
│   │   └── dropdown-menu/     # Settings dropdown
│   ├── state/index.ts         # Zustand store (persist v3)
│   ├── composables/           # useLocalStorage
│   └── assets/                # Images (always place here, never public/)
├── electron/
│   ├── main/                  # BrowserWindow + auto-updater
│   └── preload/               # contextBridge IPC + loading screen
├── e2e/
│   ├── features/              # Cucumber .feature files
│   └── steps/                 # Step definitions
├── vite.config.ts             # Vite + Electron + Vitest config
└── vite.web.config.ts         # Web-only build config
```

---

## License

MIT © Oltion Zefi
