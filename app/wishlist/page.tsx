"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { toProductListing } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import type { ProductListing } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍪",
  CLOTHING: "👕",
  ACCESSORIES: "⌚",
  OTHER: "📦",
};

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshSession } = useAuthStore();
  const setHideNavbar = useUIStore((s) => s.setHideNavbar);
  const setHideBottomNav = useUIStore((s) => s.setHideBottomNav);
  const { refresh, toggle } = useWishlistStore();
  const addCartItem = useUIStore((s) => s.addCartItem);
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHideNavbar(true);
    setHideBottomNav(true);
    return () => {
      setHideNavbar(false);
      setHideBottomNav(false);
    };
  }, [setHideNavbar, setHideBottomNav]);

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      await refresh(user.id);

      if (cancelled) return;

      const ids = Array.from(useWishlistStore.getState().wishlistIds);

      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("product_listings")
        .select("*")
        .in("id", ids);

      if (cancelled) return;

      setProducts((data ?? []).map(toProductListing));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const handleToggle = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    await toggle(user.id, productId);
  };

  const handleQuickAdd = (product: ProductListing, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addCartItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      quantity: 1,
      image: product.images?.[0] ?? "",
      availableStock: product.quantity,
    });
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9] items-center justify-center">
        <p className="font-body text-body-md text-[#44474e]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9] items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f3f4]">
          <Heart className="h-8 w-8 text-[#44474e]" />
        </div>
        <h1 className="font-headline text-headline-lg text-[#002147] mb-2">Not signed in</h1>
        <p className="font-body text-body-md text-[#44474e] mb-6">
          Sign in to view your wishlist.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#fdc34d] text-[#271900] font-bold text-sm hover:opacity-90 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <header className="bg-white sticky top-0 w-full z-50 shadow-[0px_4px_12px_rgba(0,33,71,0.08)]">
        <div className="flex justify-between items-center px-4 h-14 w-full mx-auto">
          <button
            onClick={() => router.push("/profile")}
            className="active:scale-95 transition-transform flex items-center text-[#000a1e]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline text-headline-md font-bold text-[#000a1e] tracking-tight">
            Wishlist
          </h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="flex-1 px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-body text-body-md text-[#44474e]">Loading wishlist...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-16 h-16 text-[#c4c6cf] mb-4" style={{ strokeWidth: 1 }} />
            <p className="font-headline text-headline-sm text-[#1a1c1c] mb-1">
              Your wishlist is empty
            </p>
            <p className="font-body text-body-md text-[#44474e] mb-4">
              Products you like will appear here.
            </p>
            <Link
              href="/"
              className="font-bold text-[#002147] underline underline-offset-4"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-8">
            {products.map((product) => {
              const icon = CATEGORY_ICONS[product.category] || "📦";
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,33,71,0.08)] overflow-hidden flex flex-col transition-all hover:shadow-[0px_8px_24px_rgba(0,33,71,0.12)] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <div className="relative aspect-square w-full bg-[#f3f3f4] flex items-center justify-center text-4xl overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : icon}
                    <button
                      type="button"
                      onClick={(e) => handleToggle(product.id, e)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm transition-transform active:scale-90"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <span
                      className="self-start font-label text-label-md px-[6px] py-[1px] rounded-sm"
                      style={{ backgroundColor: "rgba(0,33,71,0.05)", color: "#002147" }}
                    >
                      {product.category}
                    </span>
                    <h3 className="font-body text-sm font-medium text-[#1a1c1c] truncate leading-tight">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-1">
                      <span className="font-headline text-lg font-bold text-[#B8860B]">
                        RM {product.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#002147] text-white shadow-[0px_2px_6px_rgba(0,33,71,0.15)] transition-transform active:scale-90"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
