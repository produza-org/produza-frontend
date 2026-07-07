export function loadPersistedData<T>(key: string, seed: T): T {
  if (typeof window === 'undefined') return seed;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    return seed;
  }
  return seed;
}

export function savePersistedData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}
