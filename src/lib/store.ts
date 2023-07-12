import { create } from 'zustand';
import { pb } from './pocketbase';
import { ExtendedUser } from '../types/Auth';

export type AppState = {
  user: ExtendedUser | null;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: ExtendedUser) => void;
  logoutUser: () => void;
};

export const useStore = create<AppState>((set) => ({
  user: pb.authStore.model ? pb.authStore.model : null,
  setUser: (user) => set(() => ({ user: user })),
  logoutUser: () => {
    pb.authStore.clear();
    set(() => ({ user: null }));
  },
}));
