import { create } from 'zustand';
import type { AuthUser } from '@/core/types';
import {
  readStoredAccessToken,
  writeStoredAccessToken,
} from '@/core/store/authToken';

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated';

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  status: AuthStatus;
  setSession: (accessToken: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  setStatus: (status: AuthStatus) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: readStoredAccessToken(),
  user: null,
  status: 'idle',
  setSession: (accessToken, user) => {
    writeStoredAccessToken(accessToken);
    set({ accessToken, user, status: 'authenticated' });
  },
  setUser: (user) => set({ user, status: 'authenticated' }),
  setStatus: (status) => set({ status }),
  clearSession: () => {
    writeStoredAccessToken(null);
    set({ accessToken: null, user: null, status: 'unauthenticated' });
  },
}));
