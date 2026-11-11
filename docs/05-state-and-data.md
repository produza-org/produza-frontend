# State and data

## When to use what

- **React Context** – Used for theme and language because they affect the whole tree and are consumed by many components. Values are stable; updates are rare (toggle theme, change language). Implemented in `contexts/ThemeContext.tsx` and `contexts/LanguageContext.tsx`.
- **Zustand** – For global app state that is shared across features and is not purely “UI tree” state (e.g. user session, app-wide flags). Auth session lives in `core/store/useAuthStore.ts` (access token + user/org identity); a placeholder store remains in `core/store/useAppStore.ts`. Add slices or new stores in `core/store/` as needed.
- **Feature-local state** – Everything else: component `useState`, feature-specific hooks, or a Zustand store scoped to one feature. Keep it inside the feature folder.
- **Forms** – Form state and validation are handled with **react-hook-form** inside features. Use shared components from `shared/components` for inputs; keep form logic and schemas in the feature.

## API layer

- **core/api/client.ts** – Single HTTP client (e.g. `apiClient(path, options)`). Uses `core/config/env` for base URL. Attaches `Authorization: Bearer` from `useAuthStore` when a token is present, and clears the session on HTTP 401.
- **Feature API** – Each feature can define its own API functions (e.g. `features/auth/api/login.ts`) that call the core client. This keeps endpoints and request/response types close to the feature and leaves the core client generic. Auth endpoints live under `features/auth/api/`.

Do not put feature-specific URLs or types in `core`; keep them in the feature and use the shared client from `core/api`.
