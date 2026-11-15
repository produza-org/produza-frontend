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
| **core/mocks/** | Legacy seed JSON / persistence helpers. Raw materials no longer use localStorage; prefer feature API modules. |
| **shared/components/** | Buttons, inputs, layout primitives, dialogs, drawers, and menus used in multiple features. Organized as `layout/` (responsive shell: temporary nav below `md`), `form/`, `dialog/`, `drawer/` (`EntityDetailDrawer` + `DetailBreakdownList` for Stitch-style list-row detail panels: eyebrow, stats card, optional breakdown, Edit/Delete footer), `actions/`, `page/` (`PageRoot`, `PageTitle`, `PageSubtitle`, `PageBreadcrumbs` from pathname matching). Mobile-first layout rules: `.cursor/rules/mobile-first-responsive.mdc`. |
| **shared/toast/** | Shared mutation feedback: `ToastProvider` + `useToast` (`enqueueToast`), mounted from `AppProviders`. |
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
├── pages/            Route-level screens (list, create, edit, recipe, …)
├── components/       Feature UI (e.g. list/, form/, recipe/)
├── hooks/            Feature-local hooks
├── context/          Feature provider + context (when needed)
├── utils/            Pure helpers scoped to the feature
├── types/            Feature domain types
├── constants.ts      Feature constants
└── index.ts          Public API for app routes (pages, provider, shared types)
```

Products include a 2-step create wizard at `/products/new` under `features/products/components/create/` (`ProductCreateWizard`: general info → recipe). Existing products still use edit at `/products/:id/edit` and a nested recipe editor at `/products/:id/recipe` under `features/products/pages/recipe/` and `components/recipe/` (`RecipeDraftPanel` shared by create step 2 and `RecipeEditor`). Recipe lines are raw materials only (`rawMaterialId` + `proportion`, Σ = 1); the material picker is a searchable `FormAutocomplete`.

Production orders live under `features/production-orders/` with list, create, and detail pages at `/production-orders`, `/production-orders/new`, and `/production-orders/:id`. The detail page includes floor steps (`FloorStepsPanel`) and actual production (`realProduzido`) alongside QTD. LOTE need lines.

List tables for raw materials, products, and production orders open a shared right-side `EntityDetailDrawer` (`shared/components/drawer/`) on row click. The drawer chrome matches the Stitch detail layout (eyebrow, title, summary stats, hairline, optional `DetailBreakdownList` body, sticky Edit/Delete footer). Desktop paper width is ~500px (full width on mobile). Raw materials use the same breakdown-row body layout as products (MP-specific fields: code, status, unit, min stock, unit cost, dates); products show recipe lines when available; production orders keep overview fact rows plus needs breakdown. Production orders wire Delete to `DELETE /production-orders/:id` with the same confirm + toast pattern as catalog lists. Feature-specific panels live under each feature’s `components/detail/`. Action-menu cells use `stopPropagation` so menus do not open the drawer.

Use barrel `index.ts` in a folder when it helps keep imports short; export only what is part of the folder’s public API.
