# Theme and language

Global theme (light/dark) and language (Portuguese/English) are implemented with React Context and persisted in `localStorage`.

## Theme

- **Implementation:** `src/theme/index.ts` exports `createAppTheme(mode)` which calls MUI’s `createTheme()` with `palette.mode: 'light' | 'dark'`.
- **Context:** `src/contexts/ThemeContext.tsx` provides `mode` and `toggleTheme()`. The provider wraps the app with MUI’s `ThemeProvider` and `CssBaseline`.
- **Persistence:** The chosen mode is stored in `localStorage` under `app-theme-preference`. On load, that value is used; if missing, the system preference (`prefers-color-scheme: dark`) is used, then fallback to `light`.
- **Usage:** Call `useThemeMode()` inside the tree wrapped by `ThemeProvider` to get `{ mode, toggleTheme }`.

To change colors or typography, edit `createAppTheme()` in `src/theme/index.ts` (e.g. `palette.primary`, `typography`).

## Language

- **Implementation:** i18n is initialized in `src/i18n/index.ts` with `react-i18next`, resources from `src/i18n/locales/pt.json` and `en.json`, `lng: 'pt'`, `fallbackLng: 'en'`.
- **Context:** `src/contexts/LanguageContext.tsx` provides `language` (`'pt' | 'en'`) and `setLanguage(lang)`. `setLanguage` calls `i18n.changeLanguage(lang)` and saves to `localStorage` under `app-language`.
- **Persistence:** On load, the stored language is read and applied via `i18n.changeLanguage()` in the provider.
- **Usage:** Call `useLanguage()` for `{ language, setLanguage }`; use `useTranslation()` from `react-i18next` for `t('key')`.

To add a language: add a new JSON file in `i18n/locales/`, register it in `i18n/index.ts` in `resources`, and extend the `AppLanguage` type and UI (e.g. dropdown) in `LanguageContext` and the language selector component.
