# AGENTS.md — Burger Project Guide for AI Agents

> This file is the authoritative reference for any AI agent working in this repository.
> Read it fully before making changes.

---

## Project Overview

**The Grid** is a cross-platform desktop application (Electron + React) that lets users browse and order burgers, view delivery locations on an interactive map, manage their account, build a custom burger, and access recipes and FAQs. Store owners use an admin panel (PIN-gated) to manage burgers, locations, builder ingredients, and branding.

- **Author:** Oltion Zefi
- **License:** MIT
- **Entry:** `dist/main/index.js` (Electron main process)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop Runtime | Electron 35 |
| UI Framework | React 19 |
| Build Tool | Vite 6 |
| Language | TypeScript 5 (strict) |
| State Management | Zustand 5 (persisted to `sessionStorage`, version 3) |
| UI Components | **HeroUI v3** (`@heroui/react`) |
| Styling | **Tailwind CSS v4** (via HeroUI styles import — no separate config file) |
| Icons | **lucide-react** |
| Dark Mode | **next-themes** (`ThemeProvider`, `attribute="class"`, `defaultTheme="system"`) |
| Routing | React Router 7 (`react-router`) |
| Maps | Leaflet 1.9 + react-leaflet 5 |
| Unit Testing | Vitest 3 + Testing Library (jsdom, `--run` flag, exits after completion) |
| E2E Testing | Playwright 1.51 + Cucumber BDD (28 scenarios) |
| Linting | ESLint 9 (Airbnb + TypeScript ESLint) |
| Formatting | Prettier 3 (single quotes, 100 char width) |
| Git Hooks | Husky 9 (pre-commit: format → lint → test) |

---

## Repository Structure

```
burger/
├── src/
│   ├── main.tsx                  # Entry (ThemeProvider, Toast.Provider, HashRouter)
│   ├── App.tsx                   # Root component — routing, layout (Tailwind divs only)
│   ├── App.css / index.css       # Global styles (HeroUI styles import + brand overrides)
│   ├── test-setup.ts             # Vitest global setup (suppress jsdom framework noise)
│   ├── __mocks__/fileMock.ts     # Asset stub for tests (prevents empty src="" warnings)
│   ├── components/
│   │   ├── navigation/           # Sticky header nav (HeroUI Button/Badge/Separator)
│   │   ├── dropdown-menu/        # Settings/account dropdown — HeroUI Dropdown
│   │   ├── cart-drawer/          # Slide-out cart (HeroUI)
│   │   └── icons/BurgerTypeIcons.tsx  # Burger type icon map
│   ├── modules/
│   │   ├── burger/               # Burger grid + ordering (HeroUI Card/Button/Chip, toast)
│   │   │   ├── api/fetchBurger.ts        # DEFAULT_BURGERS, ALL_TOPPINGS exports
│   │   │   └── components/BurgerCustomizeModal.tsx
│   │   ├── build/                # Custom burger builder — step-by-step visual assembly
│   │   │   ├── api/ingredients.ts
│   │   │   └── components/       # BurgerBoard, IngredientPicker, NameBurgerModal
│   │   ├── location/             # Leaflet map with delivery markers
│   │   │   └── api/fetchLocations.ts
│   │   ├── recipe/               # Recipe cards with expand/collapse
│   │   │   └── api/fetchRecipes.ts
│   │   ├── account/              # Loyalty card UI (HeroUI Card/Avatar/Tooltip/Button)
│   │   ├── settings/             # App preferences — persisted via Zustand
│   │   ├── faq/                  # Accordion Q&A (HeroUI Accordion)
│   │   ├── terms/                # Terms & Conditions page (implicit agreement)
│   │   └── admin/                # PIN-gated admin panel (PIN: 1234)
│   │       └── sections/         # Dashboard, BurgersAdmin, LocationsAdmin, BuilderAdmin, StoreAdmin
│   ├── state/index.ts            # Zustand store (cart + user prefs + admin CRUD, version 3)
│   ├── composables/              # Custom React hooks (useLocalStorage)
│   ├── commands/ipc.ts           # IPC renderer → main listeners
│   └── assets/                   # Static assets (burger.webp) — ALL images go here
│
├── electron/
│   ├── main/index.ts             # BrowserWindow, single-instance lock
│   ├── main/update.ts            # Auto-updater
│   └── preload/index.ts          # contextBridge IPC API + loading screen
│
├── e2e/
│   ├── features/                 # Cucumber .feature files (28 scenarios)
│   ├── steps/                    # Step definitions (BurgerWorld)
│   └── support/                  # world.ts, hooks.ts, timeout.ts
├── vite.config.ts                # Vite + Electron plugin + Vitest config
├── vite.web.config.ts            # Web-only build (no Electron) for E2E preview
├── cucumber.mjs                  # Cucumber config
└── package.json
```

---

## Central Styling System

**All styling goes through HeroUI + Tailwind CSS v4. No component-level CSS files.**

`src/index.css` imports HeroUI's bundled styles (which already include Tailwind v4):

```css
@import "@heroui/react/styles";
```

Brand colour overrides (orange accent):

```css
:root, .light { --accent: oklch(0.72 0.19 41); }  /* #f97316 orange */
.dark          { --accent: oklch(0.78 0.17 41); }
```

Extra global tokens via Tailwind v4 `@theme inline`:

```css
@theme inline {
  --font-sans: "Inter", system-ui, sans-serif;
  --color-brand: oklch(0.72 0.19 41);
}
```

Provider setup in `src/main.tsx`:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <HashRouter>
    <Toast.Provider placement="bottom end">
      <App />
    </Toast.Provider>
  </HashRouter>
</ThemeProvider>
```

---

## HeroUI v3 Component API

HeroUI v3 uses **compound components** (`Root`, `Content`, `Trigger`, etc.):

| Component | Key usage |
|---|---|
| `Button` | `variant="primary\|secondary\|ghost\|outline\|danger\|danger-soft\|tertiary"` `size="sm\|md\|lg"` `isIconOnly` |
| `Card` | `<Card><Card.Header /><Card.Content /><Card.Footer /></Card>` |
| `Accordion` | `<Accordion><Accordion.Item><Accordion.Trigger /><Accordion.Panel /></Accordion.Item></Accordion>` |
| `Dropdown` | `<Dropdown><Dropdown.Trigger /><Dropdown.Popover><Dropdown.Menu><Dropdown.Item /></Dropdown.Menu></Dropdown.Popover></Dropdown>` |
| `Switch` | `<Switch isSelected onChange><Switch.Control><Switch.Thumb /></Switch.Control></Switch>` |
| `Radio`/`RadioGroup` | `<RadioGroup aria-label="..."><Radio value="x" aria-label="..."><Radio.Control><Radio.Indicator /></Radio.Control><Radio.Content /></Radio></RadioGroup>` |
| `Avatar` | `<Avatar><Avatar.Image /><Avatar.Fallback>MM</Avatar.Fallback></Avatar>` |
| `Tooltip` | `<Tooltip><Tooltip.Trigger /><Tooltip.Content /></Tooltip>` |
| `toast` (imperative) | `import { toast } from '@heroui/react'; toast.success('msg', { description: '...', timeout: 2000 })` |

> **Always add `aria-label` to `RadioGroup` and each `Radio`** — HeroUI v3 warns in jsdom without them.

---

## Routes

| Path | Module | Description |
|---|---|---|
| `/` | `burger` | Default — burger grid/ordering |
| `/build` | `build` | Custom burger builder (accessible from home CTA, not nav) |
| `/location` | `location` | Leaflet map with delivery markers |
| `/recipe` | `recipe` | Recipe cards with expand/collapse |
| `/settings` | `settings` | Appearance, location toggle, preferred pickup |
| `/account` | `account` | Loyalty card / user info |
| `/faq` | `faq` | Accordion FAQ |
| `/terms` | `terms` | Terms & Conditions (implicit agreement, no checkbox) |
| `/admin` | `admin` | PIN-gated admin panel (PIN: `1234`) |

> **Nav links** (visible in header): Burgers · Locations · Recipes  
> **Build** is accessed via the "Build your burger" CTA on the home page, not the nav.

---

## Zustand Store (`src/state/index.ts`)

Persist version: **3** — bump when adding/removing top-level fields and update `migrate`.

| State | Type | Description |
|---|---|---|
| `burgers` | `CartItem[]` | Shopping cart |
| `locationEnabled` | `boolean` (default `false`) | Persisted location permission toggle |
| `preferredLocationId` | `string \| null` | User's preferred pickup |
| `shopLocations` | `ShopLocation[]` | Admin-managed shop locations |
| `menuBurgers` | `Burger[]` | Admin-managed menu |
| `builderIngredients` | `Ingredient[]` | Admin-managed builder ingredients |
| `storeConfig` | `StoreConfig` | Store name + emoji |

---

## Key Commands

```bash
npm run dev              # Vite dev server (Electron)
npm run debug            # Dev with Electron debug (React DevTools)
npm run build            # tsc → vite build → electron-builder
npm run test             # Vitest unit tests (jsdom, exits after run)
npm run test:coverage    # Vitest with v8 coverage (exits after run)
npm run e2e:cucumber     # Cucumber BDD E2E tests (requires vite preview running)
npm run lint:fix         # ESLint auto-fix
npm run format:fix       # Prettier auto-fix
```

---

## Coding Conventions

### TypeScript
- **Strict mode is enabled** — no implicit `any`.
- Use the `@/*` path alias (maps to `src/*`).
- `tsconfig.node.json` uses `moduleResolution: "Bundler"` — required for `@tailwindcss/vite`.
- When importing a type and value from the same module, use `type` qualifier.

### Components
- Feature pages → `src/modules/<feature>/index.tsx`
- Reusable UI → `src/components/<component>/index.tsx`
- **No component-level CSS files** — Tailwind utilities only.
- Co-locate tests: `__test__/index.spec.tsx` inside the component folder.
- All images/static assets → `src/assets/` (never `public/` or project root).

### Icons
- Use **lucide-react** for all icons. Do not use Radix icons.

### State Management
- Zustand in `src/state/index.ts` for all persisted/global state.
- `useState` for local ephemeral UI state only.
- Never mutate Zustand state directly — always use actions.

### Dark Mode
- Controlled by `next-themes`. Access via `const { theme, setTheme } = useTheme()`.
- In tests: mock `window.matchMedia` before rendering components using `useTheme`.

### Toast Notifications
- `Toast.Provider` is already in `src/main.tsx` — do not add another.
- Usage: `toast.success('Title', { description: '...' })`.

### IPC
- Never import `electron` or Node built-ins directly in renderer code.

### Terms & Conditions
- No checkbox. By using the app the user has implicitly agreed.
- Link to `/terms` page from Settings Privacy card.

---

## Testing Conventions

- **Router-dependent components**: wrap in `<MemoryRouter>`.
- **Theme-dependent** (using `useTheme`): wrap in `<ThemeProvider>` + mock `window.matchMedia`.
- **HeroUI Dropdown**: do not `fireEvent.click` triggers — React Aria keyboard internals error in jsdom. Test render only.
- **`onPress` handlers**: use `e?.continuePropagation?.()` (guard `e` itself, not just the method) — `fireEvent.click` passes `undefined` in jsdom.
- **Image imports**: `src/__mocks__/fileMock.ts` stubs all asset imports so `<img src>` is never empty.
- **E2E**: app uses `HashRouter` — navigate via `/#/path` format (e.g. `page.goto('http://localhost:4173/#/settings')`).

---

## Do's and Don'ts

**DO:**
- Use HeroUI components for all UI.
- Use lucide-react for icons.
- Use Tailwind utility classes for layout/spacing.
- Use `@/` alias for all src imports.
- Put all images in `src/assets/`.
- Add `aria-label` to every `RadioGroup` and `Radio`.
- Run `npm run test` before committing.
- Use `window.confirm` (not `confirm`) and `Number.isNaN` (not `isNaN`).

**DON'T:**
- Create component-level `.css` files.
- Use Radix UI packages (fully removed).
- Use Button `variant="solid"` or `variant="soft"` (not in HeroUI v3).
- Import `electron` or Node built-ins in renderer code.
- Use `any` types.
- Add a second `<Toast.Provider>`.
- Mutate Zustand state directly.
- Put images in `public/` or the project root.
- Add a T&C checkbox — use implicit agreement + `/terms` link.
