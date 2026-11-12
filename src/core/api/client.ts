import { config } from '@/core/config/env';
import { useAuthStore } from '@/core/store/useAuthStore';
import type { ApiErrorBody } from '@/core/types';

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = body.statusCode;
    this.body = body;
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;
  return (
    typeof body.statusCode === 'number' &&
    typeof body.error === 'string' &&
    typeof body.message === 'string'
  );
}

async function readApiErrorBody(response: Response): Promise<ApiErrorBody> {
  const payload: unknown = await response.json().catch(() => null);
  if (isApiErrorBody(payload)) {
    return payload;
  }

  return {
    statusCode: response.status,
    error: response.statusText || 'Error',
    message: `API error: ${response.status} ${response.statusText}`,
  };
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.apiBaseUrl}${path}`;
  const accessToken = useAuthStore.getState().accessToken;
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().clearSession();
    }
    throw new ApiError(await readApiErrorBody(response));
  }

  return response.json() as Promise<T>;
}
