export const AUTH_TOKEN_STORAGE_KEY = 'produza-access-token';

function getLocalStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredAccessToken(): string | null {
  return getLocalStorage()?.getItem(AUTH_TOKEN_STORAGE_KEY) ?? null;
}

export function writeStoredAccessToken(token: string | null): void {
  const storage = getLocalStorage();
  if (!storage) return;
  if (token) {
    storage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    return;
  }
  storage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
