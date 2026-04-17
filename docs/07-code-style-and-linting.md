# Code style and linting

## Tools

- **ESLint** – `eslint.config.js` (flat config). TypeScript, React hooks, and React Refresh are enabled. Formatting rules are turned off in favour of Prettier.
- **Prettier** – `.prettierrc` and `.prettierignore`. Use for consistent formatting.

Scripts: `yarn lint`, `yarn lint:fix`, `yarn format`, `yarn format:check`.

## Conventions

- **No `console.log`** in committed code. ESLint can warn on `console` (with `warn`/`error` allowed if needed).
- **Reuse components** – Prefer shared components in `shared/components` and composition over duplicating UI.
- **No comments in code** – Prefer clear names and small functions; avoid explanatory comments unless necessary (e.g. non-obvious workarounds).
- **Naming:** PascalCase for components and types, camelCase for functions and variables. Suffixes like `*.types.ts` or `*.api.ts` are optional for clarity.

Run `yarn lint` and `yarn format:check` before committing (or in CI) to keep the codebase consistent.
