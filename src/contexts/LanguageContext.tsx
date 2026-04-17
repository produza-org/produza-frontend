import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import i18n from '@/i18n';

const LANGUAGE_STORAGE_KEY = 'app-language';

export type AppLanguage = 'pt' | 'en';

function getInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'pt';
  const stored = localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  ) as AppLanguage | null;
  if (stored === 'pt' || stored === 'en') return stored;
  return 'pt';
}

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] =
    useState<AppLanguage>(getInitialLanguage);

  useEffect(() => {
    i18n.changeLanguage(getInitialLanguage());
  }, []);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
