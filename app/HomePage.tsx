"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { toProductListing } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import type { ProductListing } from "@/types";
import {
  Search,
  Heart,
  ShoppingCart,
  Package,
  UtensilsCrossed,
  Shirt,
  Watch,
} from "lucide-react";

const CATEGORIES = [
  { key: "FOOD", label: "Food", icon: UtensilsCrossed },
  { key: "CLOTHING", label: "Clothing", icon: Shirt },
  { key: "ACCESSORIES", label: "Accessories", icon: Watch },
  { key: "OTHER", label: "Other", icon: Package },
] as const;

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍪",
  CLOTHING: "👕",
  ACCESSORIES: "⌚",
  OTHER: "📦",
};

export default function HomePage() {
  const { searchQuery, setSearchQuery, addCartItem } = useUIStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchProducts = () => {
      supabase
        .from("product_listings")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            setError(error.message);
          } else {
            setProducts((data ?? []).map(toProductListing));
          }
          setLoading(false);
        });
    };

    fetchProducts();

    const channel = supabase
      .channel("homepage")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_listings" },
        () => {
          supabase
            .from("product_listings")
            .select("*")
            .eq("is_available", true)
            .order("created_at", { ascending: false })
            .then(({ data }) => {
              if (data) setProducts(data.map(toProductListing));
            });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCat = selected === null || product.category === selected;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [searchQuery, selected, products]);

  const handleQuickAdd = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const product = products.find((p) => p.id === id);
      if (product) {
        addCartItem({
          productId: product.id,
          title: product.title,
          price: product.price,
          category: product.category,
          quantity: 1,
          image: product.images?.[0] ?? "",
          availableStock: product.quantity,
        });
      }
    },
    [products, addCartItem],
  );

  const toggleLike = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-bold text-base text-slate-900">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <p className="text-6xl mb-4">⚠️</p>
        <p className="font-bold text-base text-slate-900 mb-1">Failed to load products</p>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white pb-3 shadow-sm px-4 pt-4">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            placeholder="Search campus services and products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 rounded-2xl py-3 pl-12 pr-4 font-body text-body-md text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400/50"
          />
        </div>

        {/* Browse Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-lg">
              Browse Categories
            </h3>
            {selected !== null && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="bg-amber-400 text-xs px-3 py-1.5 rounded-lg font-semibold text-slate-900"
              >
                Remove filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 w-full justify-items-center px-2 mt-2">
            {CATEGORIES.map(({ key, label, icon: Icon }) => {
              const active = selected === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(selected === key ? null : key)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                      active
                        ? "bg-amber-400 text-slate-900"
                        : "bg-zinc-100 text-slate-600"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 pt-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="text-slate-400 w-12 h-12 mb-3" />
            <p className="font-bold text-base text-slate-900 mb-1">
              No products found
            </p>
            <p className="text-sm text-slate-400">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const icon = CATEGORY_ICONS[product.category] || "📦";
              const isLiked = likedIds.has(product.id);
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-square w-full bg-slate-100 flex items-center justify-center text-4xl overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : icon}
                    <button
                      type="button"
                      onClick={(e) => toggleLike(product.id, e)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm transition-transform active:scale-90"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-slate-500"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <span className="bg-amber-400 text-slate-900 text-xs font-semibold px-2.5 py-0.5 rounded-md w-fit">
                      {product.category}
                    </span>
                    <h3 className="text-slate-900 font-bold text-base leading-tight truncate">
                      {product.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-900 font-bold text-lg">
                        RM {product.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product.id, e)}
                        className="bg-[#002147] text-white rounded-full p-2.5 shadow-sm transition-transform active:scale-95"
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
      </div>
    </div>
  );
}
