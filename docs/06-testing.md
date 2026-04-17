# Testing

## Setup

- **Runner:** Vitest, configured in `vite.config.ts` under the `test` block.
- **Environment:** `jsdom` for DOM and browser APIs.
- **Globals:** Vitest globals are enabled; `describe`, `it`, `expect` are available without imports.
- **Setup file:** `src/test/setup.ts` is run before each test file; it imports `@testing-library/jest-dom` so matchers like `toBeInTheDocument()` are available.

## Where tests live

- Option A: Next to the module, e.g. `ThemeContext.tsx` and `ThemeContext.test.tsx` in the same folder.
- Option B: In a `__tests__` folder inside the feature or shared folder (e.g. `shared/components/__tests__/Button.test.tsx`).

Use one style consistently. For this base, either is fine; add tests as you add features.

## Commands

- `yarn test` – Run tests in watch mode (or once in CI).
- `yarn test:ui` – Open Vitest UI in the browser.

Coverage can be enabled in the `test` block in `vite.config.ts` with `coverage: { provider: 'v8', reporter: ['text', 'html'] }` and optional thresholds.
