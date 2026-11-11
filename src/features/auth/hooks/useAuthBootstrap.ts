import { useEffect } from 'react';
import { useAuthStore } from '@/core/store/useAuthStore';
import { fetchCurrentUser } from '@/features/auth/api';

export function useAuthBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const status = useAuthStore((state) => state.status);
  const setUser = useAuthStore((state) => state.setUser);
  const setStatus = useAuthStore((state) => state.setStatus);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const { user, status: currentStatus } = useAuthStore.getState();

      if (!accessToken) {
        if (currentStatus !== 'unauthenticated') {
          setStatus('unauthenticated');
        }
        return;
      }

      if (user && currentStatus === 'authenticated') {
        return;
      }

      setStatus('loading');

      try {
        const me = await fetchCurrentUser();
        if (!cancelled) {
          setUser(me);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [accessToken, clearSession, setStatus, setUser]);

  return status;
}
