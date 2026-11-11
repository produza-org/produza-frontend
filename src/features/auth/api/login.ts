import { apiClient } from '@/core/api';
import type { LoginCredentials, LoginResponse } from '@/core/types';

export function loginRequest(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
