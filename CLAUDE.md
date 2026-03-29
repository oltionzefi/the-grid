# CLAUDE.md

## Critical: Read AGENTS.md First

**Before doing anything in this repository, always read `AGENTS.md` in the project root.**

`AGENTS.md` contains:
- Full project overview, tech stack, and architecture
- Directory structure and routing map (including `/admin`, `/build`, `/terms`)
- Zustand store shape and persist version
- Coding conventions and patterns to follow
- Testing conventions (unit + Cucumber E2E)
- Electron IPC architecture and process model
- Explicit Do's and Don'ts for agents

Skipping `AGENTS.md` will lead to inconsistent code, broken conventions, and incorrect assumptions about the project structure.

---

## Quick Reference

```bash
npm run test          # Vitest unit tests — must pass before committing (exits automatically)
npm run test:coverage # Vitest with coverage (exits automatically)
npm run lint:fix      # ESLint auto-fix
npm run format:fix    # Prettier auto-fix
npm run dev           # Vite + Electron dev server
npm run e2e:cucumber  # Cucumber BDD E2E (28 scenarios, requires vite preview)
```

## Key Decisions Made This Session

- App name: **The Grid**
- Router: **HashRouter** (routes use `/#/path` in E2E tests)
- `Build` route is accessed from home CTA only — not in nav
- T&C: implicit agreement, no checkbox — link to `/terms` from Settings
- `locationEnabled` is persisted in Zustand (default `false`)
- Admin PIN: `1234` — manages burgers, locations, builder, store branding
- Zustand persist version: **3** — always bump + update `migrate` when changing state shape
- `moduleResolution: "Bundler"` in `tsconfig.node.json` (required for `@tailwindcss/vite`)
- All images in `src/assets/` — never `public/` or project root
- `npm run test` uses `--run` flag so it always exits

## Commit Trailer

Always include the following Co-authored-by trailer in commit messages:

