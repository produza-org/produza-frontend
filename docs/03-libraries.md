# Libraries

Main dependencies and how they are used in this project.

| Library | Purpose |
|--------|--------|
| **Vite** | Build tool and dev server. Handles TypeScript/JSX, path aliases (`@/`), and HMR. |
| **React 18** | UI library. Used with hooks and (where needed) concurrent features. |
| **TypeScript** | Static typing. Strict mode; path aliases aligned with Vite. |
| **Vitest** | Unit and component tests. Same config as Vite; uses jsdom and Testing Library. |
| **Zustand** | Optional global state (e.g. `core/store`). Used when state is shared across features and not tied to UI tree. |
| **react-hook-form** | Form state and validation inside features. Use for complex or validated forms. |
| **i18next / react-i18next** | Internationalization. Init in `i18n/`; locales in `i18n/locales/`; `useTranslation()` in components. |
| **MUI (Material UI)** | Component library and theming. Theme built in `theme/`; ThemeProvider wraps the app. |
| **Recharts** | Charts on the company dashboard (`features/dashboard`). Prefer theme `palette.produza` colors via chart helpers. |
| **React Router** | Client-side routing. Routes defined in `app/routes.tsx`; `BrowserRouter` in providers. |
| **ESLint** | Linting (TypeScript, React hooks, React Refresh). Flat config in `eslint.config.js`. |
| **Prettier** | Code formatting. Run via `format` / `format:check`; ESLint formatting rules disabled in favour of Prettier. |

All of these are configured once at the project level; new features use them without extra setup (e.g. use `@/` for imports, MUI components, and `useTranslation` where needed).
