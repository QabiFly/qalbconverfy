import { create } from "zustand";
import { UserProfile } from "@/types";
import { tokenStorage } from "@/lib/api/token-storage";
import { onSessionExpired } from "@/lib/api/client";

interface AuthState {
  user: UserProfile | null;
  isHydrating: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setHydrating: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create < AuthState > ((set) => ({
  user: null,
  isHydrating: true,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  setHydrating: (value) => set({ isHydrating: value }),
  
  logout: () => {
    tokenStorage.clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));

if (typeof window !== "undefined") {
  onSessionExpired(() => {
    useAuthStore.getState().logout();
  });
}