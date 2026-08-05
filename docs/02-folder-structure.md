# Folder structure

All application code lives under `src/`. Below is the tree and when to use each folder.

## Tree

```
src/
├── app/              Routing and app shell
├── core/             Infrastructure
├── shared/           Reusable across features
├── features/         One folder per domain
├── contexts/         Global React contexts
├── i18n/             i18n config and locale files
├── theme/            MUI theme factory
├── test/             Test setup (e.g. Jest DOM)
├── main.tsx          Entry point
└── vite-env.d.ts     Vite type references
```

## When to add files where

| Folder | Use for |
|--------|--------|
| **app/** | Root layout, route list, provider composition. Add new top-level routes or providers here. |
| **core/api/** | HTTP client and base request logic. Add interceptors or new client helpers here. |
| **core/config/** | Env and app config. Add new `VITE_*` usage and typed config here. |
| **core/types/** | Types used in more than one feature or by core itself. |
| **core/store/** | Zustand (or other) global stores used across features. |
| **core/mocks/** | Seed JSON and persistence helpers used by features before a real API. |
| **shared/components/** | Buttons, inputs, layout primitives, dialogs, and menus used in multiple features. Organized as `layout/`, `form/`, `dialog/`, `actions/`, `page/`. |
| **shared/hooks/** | Hooks reused across features (e.g. debounce, media query). |
| **shared/utils/** | Pure helpers (formatting, validation, etc.). |
| **shared/constants/** | Global constants (e.g. routes, config keys). |
| **features/** | New domain = new subfolder (e.g. `features/auth/`). Put components, hooks, API, types for that domain inside. |
| **contexts/** | New app-wide React Context (e.g. theme, language). One file per context + hook. |
| **i18n/** | i18n init and locale JSON. Add new languages or namespaces here. |
| **theme/** | MUI `createTheme` and tokens (`produzaTokens.ts`). Change palette, typography, or breakpoints here. |
| **test/** | Global test setup (e.g. `setup.ts` for Testing Library). Feature tests can live next to code or in `__tests__`. |

## Feature layout

Each feature under `src/features/<name>/` typically includes:

```
features/<name>/
├── pages/            Route-level screens (list, create, edit, …)
├── components/       Feature UI (e.g. list/, form/)
├── hooks/            Feature-local hooks
├── context/          Feature provider + context (when needed)
├── utils/            Pure helpers scoped to the feature
├── types/            Feature domain types
├── constants.ts      Feature constants
└── index.ts          Public API for app routes (pages, provider, shared types)
```

Use barrel `index.ts` in a folder when it helps keep imports short; export only what is part of the folder’s public API.
