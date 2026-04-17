import { create } from 'zustand';

type AppState = {
  placeholder: boolean;
};

export const useAppStore = create<AppState>(() => ({
  placeholder: true,
}));
