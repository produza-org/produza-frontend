# Frontend Structure

A frontend base project with a feature-based architecture, theme and language switching, and shared tooling for future panel developments.

## Prerequisites

- Node.js 24
- Yarn 4 (or npm)

## Commands

- `yarn install` – Install dependencies
- `yarn dev` – Start dev server
- `yarn build` – Type-check and build for production
- `yarn preview` – Preview production build
- `yarn test` – Run tests (Vitest)
- `yarn lint` – Lint (ESLint)
- `yarn format` – Format code (Prettier)

## Architecture

The project follows a **feature-based** layout: each domain lives in its own folder under `features/`, while shared code stays in `shared/` and infrastructure in `core/`. The **app** layer handles routing, providers, and the root layout.

- **app** – Application shell: route definitions, provider composition (theme, language, router), and root layout. No business logic.
- **core** – Infrastructure used by the whole app: HTTP client (`api/`), environment config, global types, and optional global state (Zustand store). No UI.
- **shared** – Reusable across features: generic UI components, hooks, utils, and constants. Feature-specific code does not go here.
- **features** – One folder per domain (e.g. auth, dashboard). Each feature contains its own components, hooks, API calls, and types. Features must not import from other features; they use only `shared` and `core`.
- **contexts** – Global React Contexts for theme (light/dark via MUI) and language (Portuguese/English via i18n). Persisted in `localStorage`.
- **theme** – MUI theme factory (`createAppTheme(mode)`). Single place to change palette, typography, or breakpoints.
- **i18n** – i18next configuration and locale JSON files (pt/en). Add new keys or languages here.

### File tree

```
produza-frontend/
├── src/
│   ├── app/                   # Routing and app shell
│   ├── core/                  # Infrastructure
│   │   ├── api/
│   │   ├── config/
│   │   ├── store/
│   │   └── types/
│   ├── shared/                # Reusable across features
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   └── utils/
│   ├── features/              # One folder per domain (add new features here)
│   ├── contexts/              # Global React contexts
│   ├── i18n/                  # Internationalization
│   │   └── locales/
│   ├── theme/                 # MUI theme factory
│   ├── test/
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── .prettierrc
├── .prettierignore
└── .env.example
```

See the **docs/** folder for detailed architecture, libraries, and maintenance rules.
