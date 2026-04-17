# Maintenance rules

Guidelines for evolving the project without breaking the architecture.

## Adding a new feature

1. Create a folder under `features/`, e.g. `features/my-feature/`.
2. Add subfolders as needed: `components/`, `hooks/`, `api/`, `types/`, etc.
3. Export the feature’s public API via an `index.ts` barrel (e.g. page component, public hooks).
4. In `app/routes.tsx`, add a route that renders the feature’s page (or lazy-load it).
5. Do not import from other features; use only `shared` and `core`.

## Adding shared components or hooks

- Put new reusable UI in `shared/components/` (and export from `shared/components/index.ts` if you use a barrel).
- Put new reusable hooks in `shared/hooks/`.
- Keep them generic; feature-specific logic stays in the feature.

## Changing the API layer

- **Base URL or headers:** Update `core/config/env.ts` and/or `core/api/client.ts`. Document any new env vars in `.env.example`.
- **New endpoint for a feature:** Add a function in that feature’s `api/` folder that uses `apiClient` from `core/api`.

## Adding i18n keys

- Add keys to `src/i18n/locales/pt.json` and `en.json` (and any other locales).
- Use `t('key')` via `useTranslation()` in components. For nested keys, use dot notation (e.g. `app.title`).

## Adding a new language

- Add `src/i18n/locales/<locale>.json`.
- In `src/i18n/index.ts`, add the locale to `resources`.
- In `LanguageContext`, extend the `AppLanguage` type and the language selector UI.

## Updating dependencies

- Use `yarn upgrade` or `yarn add` / `yarn add -D` as needed. After upgrading, run `yarn build`, `yarn test`, and `yarn lint` to catch breaking changes.
- Prefer upgrading one major area at a time (e.g. React, then Vite, then MUI) and fix issues before moving on.
