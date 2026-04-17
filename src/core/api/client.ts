import { config } from '@/core/config/env';

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.apiBaseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}
