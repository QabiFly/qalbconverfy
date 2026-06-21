import { create } from "zustand";

interface UiState {
  isMobileNavOpen: boolean;
  isSearchOverlayOpen: boolean;
  setMobileNavOpen: (value: boolean) => void;
  setSearchOverlayOpen: (value: boolean) => void;
}

export const useUiStore = create < UiState > ((set) => ({
  isMobileNavOpen: false,
  isSearchOverlayOpen: false,
  setMobileNavOpen: (value) => set({ isMobileNavOpen: value }),
  setSearchOverlayOpen: (value) => set({ isSearchOverlayOpen: value }),
}));