import { create } from "zustand";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
}

interface UIState {
  isMobileMenuOpen: boolean;
  activeCategory: string | null;
  searchQuery: string;
  cartItemCount: number;
  cartItems: CartItem[];
  hideNavbar: boolean;
  hideBottomNav: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  addToCart: () => void;
  addCartItem: (item: CartItem) => void;
  removeCartItem: (productId: string) => void;
  updateCartItemQuantity: (productId: string, delta: number) => void;
  setHideNavbar: (hide: boolean) => void;
  setHideBottomNav: (hide: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  activeCategory: null,
  searchQuery: "",
  cartItemCount: 0,
  cartItems: [],
  hideNavbar: false,
  hideBottomNav: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addToCart: () =>
    set((state) => ({ cartItemCount: state.cartItemCount + 1 })),
  addCartItem: (item) =>
    set((state) => {
      const existing = state.cartItems.find(
        (i) => i.productId === item.productId,
      );
      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { cartItems: [...state.cartItems, item] };
    }),
  removeCartItem: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.productId !== productId),
    })),
  updateCartItemQuantity: (productId, delta) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(1, i.quantity + delta) }
            : i,
        ),
    })),
  setHideNavbar: (hide) => set({ hideNavbar: hide }),
  setHideBottomNav: (hide) => set({ hideBottomNav: hide }),
}));
