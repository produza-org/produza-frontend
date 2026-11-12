import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/core/api';
import { writeStoredAccessToken } from '@/core/store/authToken';
import { useAuthStore } from '@/core/store/useAuthStore';
import type { LoginCredentials } from '@/core/types';
import { fetchCurrentUser, loginRequest } from '@/features/auth/api';

export function useLogin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function login(credentials: LoginCredentials) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { accessToken } = await loginRequest(credentials);
      writeStoredAccessToken(accessToken);
      useAuthStore.setState({ accessToken });
      const user = await fetchCurrentUser();
      setSession(accessToken, user);
      navigate('/', { replace: true });
    } catch (error) {
      clearSession();
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('UNEXPECTED');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return { login, isSubmitting, errorMessage };
}
