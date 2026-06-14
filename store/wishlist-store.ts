import { create } from "zustand";
import { createClient } from "@/lib/supabase";

interface WishlistState {
  wishlistIds: Set<string>;
  loading: boolean;
  initialized: boolean;
  refresh: (userId: string) => Promise<void>;
  toggle: (userId: string, productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
  isRealUser: (userId: string | null | undefined) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: new Set(),
  loading: true,
  initialized: false,

  refresh: async (userId: string) => {
    if (!get().isRealUser(userId)) {
      set({ wishlistIds: new Set(), loading: false, initialized: true });
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", userId);
    if (error) {
      console.error("wishlist refresh error:", error.message);
      set({ wishlistIds: new Set(), loading: false, initialized: true });
      return;
    }
    const ids = new Set((data ?? []).map((r: { product_id: string }) => r.product_id));
    set({ wishlistIds: ids, loading: false, initialized: true });
  },

  toggle: async (userId: string, productId: string) => {
    if (!get().isRealUser(userId)) {
      console.warn("Cannot toggle wishlist: user is not authenticated");
      return;
    }
    const { wishlistIds } = get();
    const supabase = createClient();
    if (wishlistIds.has(productId)) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);
      if (error) {
        console.error("wishlist delete error:", error.message);
        return;
      }
      const next = new Set(wishlistIds);
      next.delete(productId);
      set({ wishlistIds: next });
    } else {
      const { error } = await supabase.from("wishlists").insert({
        user_id: userId,
        product_id: productId,
      });
      if (error) {
        console.error("wishlist insert error:", error.message);
        return;
      }
      const next = new Set(wishlistIds);
      next.add(productId);
      set({ wishlistIds: next });
    }
  },

  /** Check if a user ID is from a real Supabase Auth session (not the mock fallback) */
  isRealUser: (userId: string | null | undefined): boolean => {
    if (!userId) return false;
    // The MOCK_USER id is only used when no real session exists
    return userId !== "00000000-0000-0000-0000-000000000001";
  },

  isLiked: (productId: string) => {
    return get().wishlistIds.has(productId);
  },
}));
