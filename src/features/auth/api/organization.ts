import { apiClient } from '@/core/api';
import type { AuthOrganization } from '@/core/types';

export function fetchCurrentOrganization(): Promise<AuthOrganization> {
  return apiClient<AuthOrganization>('/organizations/me');
}
