import { create } from "zustand";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
  availableStock: number;
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
      let items: CartItem[];
      if (existing) {
        const newQty = existing.quantity + item.quantity;
        if (newQty > existing.availableStock) {
          alert(`Only ${existing.availableStock} items available. You already have ${existing.quantity} in your cart.`);
          return state;
        }
        items = state.cartItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: newQty }
            : i,
        );
      } else {
        if (item.quantity > item.availableStock) {
          alert(`Only ${item.availableStock} items available.`);
          return state;
        }
        items = [...state.cartItems, item];
      }
      return { cartItems: items, cartItemCount: items.length };
    }),
  removeCartItem: (productId) =>
    set((state) => {
      const items = state.cartItems.filter((i) => i.productId !== productId);
      return { cartItems: items, cartItemCount: items.length };
    }),
  updateCartItemQuantity: (productId, delta) =>
    set((state) => {
      const item = state.cartItems.find((i) => i.productId === productId);
      if (!item) return state;
      const newQty = item.quantity + delta;
      if (newQty > item.availableStock) {
        alert(`Only ${item.availableStock} items available. You already have ${item.quantity} in your cart.`);
        return state;
      }
      return {
        cartItems: state.cartItems.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(1, newQty) }
            : i,
        ),
      };
    }),
  setHideNavbar: (hide) => set({ hideNavbar: hide }),
  setHideBottomNav: (hide) => set({ hideBottomNav: hide }),
}));
