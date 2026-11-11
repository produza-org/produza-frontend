import { apiClient } from '@/core/api';
import type { AuthUser } from '@/core/types';

export function fetchCurrentUser(): Promise<AuthUser> {
  return apiClient<AuthUser>('/auth/me');
}
