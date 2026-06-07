import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  activeCategory: string | null;
  searchQuery: string;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  activeCategory: null,
  searchQuery: "",
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
