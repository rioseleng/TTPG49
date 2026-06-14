"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { toProductListing } from "@/lib/utils";
import type { ProductListing } from "@/types";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, CreditCard } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍪",
  CLOTHING: "👕",
  ACCESSORIES: "⌚",
  OTHER: "📦",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addCartItem = useUIStore((s) => s.addCartItem);
  const { user, refreshSession } = useAuthStore();
  const { wishlistIds, refresh, toggle } = useWishlistStore();
  const [product, setProduct] = useState<ProductListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    if (user) refresh(user.id);
  }, [user?.id]);

  const isLiked = product ? wishlistIds.has(product.id) : false;

  const handleToggleLike = () => {
    if (!user || !product) return;
    toggle(user.id, product.id);
  };

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("product_listings")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setProduct(toProductListing(data));
        }
        setLoading(false);
      });

    const channel = supabase
      .channel("product-detail")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_listings", filter: `id=eq.${params.id}` },
        (payload) => {
          if (payload.new) setProduct(toProductListing(payload.new));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 text-center">
        <p className="text-[#44474e]">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-6xl">🔍</p>
        <h1 className="mb-2 text-2xl font-bold">Product not found</h1>
        <p className="mb-6 text-[#44474e]">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#002147] text-white font-bold text-sm hover:opacity-90 transition-all"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-6">
      {/* Back Button */}
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={() => router.back()}
          className="active:scale-95 transition-transform flex items-center"
        >
          <ArrowLeft className="w-6 h-6 text-[#000a1e]" />
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleToggleLike}
            className="active:scale-95 transition-transform flex items-center"
          >
            <Heart
              className={`w-6 h-6 ${
                isLiked ? "fill-red-500 text-red-500" : "text-[#000a1e]"
              }`}
            />
          </button>
          <button className="active:scale-95 transition-transform flex items-center">
            <Share2 className="w-6 h-6 text-[#000a1e]" />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="px-4 mt-2">
        <div className="relative w-full aspect-square bg-[#f3f3f4] rounded-xl overflow-hidden shadow-sm flex items-center justify-center text-6xl">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          ) : CATEGORY_ICONS[product.category] || "📦"}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
            <div className="w-2 h-2 rounded-full bg-white/40 shadow-sm" />
            <div className="w-2 h-2 rounded-full bg-white/40 shadow-sm" />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-4 mt-6 flex flex-col gap-6">
        {/* Title */}
        <h2 className="font-headline text-[28px] md:text-[32px] font-bold leading-[36px] md:leading-[40px] tracking-tight md:tracking-[-0.02em] text-[#000a1e]">
          {product.title}
        </h2>

        {/* Seller Info Card */}
        <div className="p-4 bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,33,71,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#002147] flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <div>
              <p className="font-headline text-[18px] font-semibold leading-6 text-[#000a1e]">
                Seller
              </p>
              <div className="flex items-center gap-1">
                <Star className="text-[#fdc34d] h-4 w-4 fill-[#fdc34d]" />
                <span className="font-body text-[14px] leading-5 text-[#44474e]">
                  4.9 (124 Ratings)
                </span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 border-2 border-[#000a1e] text-[#000a1e] rounded-lg font-label text-[12px] font-semibold leading-4 tracking-[0.05em] hover:bg-[#002147] hover:text-white transition-all active:scale-95 whitespace-nowrap">
            Message Seller
          </button>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-headline text-3xl font-bold text-[#002147]">
            RM {product.price.toFixed(2)}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              product.isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="font-body text-sm text-[#44474e]">
            {product.isAvailable ? "In Stock" : "Sold"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#44474e]">
          <span className="font-body">Quantity:</span>
          <span className="font-bold text-[#002147]">{product.quantity}</span>
          <span className="font-body">available</span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="font-headline text-[18px] font-semibold leading-6 text-[#000a1e]">
            Product Description
          </h3>
          <p className="font-body text-[16px] leading-6 text-[#44474e] leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <h3 className="font-headline text-[18px] font-semibold leading-6 text-[#000a1e]">
            Product Category
          </h3>
          <p className="font-body text-[16px] leading-6 text-[#44474e]">
            {product.category}
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 px-4 pb-4">
        <div className="flex items-center gap-3 bg-white rounded-t-xl p-4">
          <button
            onClick={() => {
              addCartItem({
                productId: product.id,
                title: product.title,
                price: product.price,
                category: product.category,
                quantity: 1,
                image: product.images?.[0] ?? "",
                availableStock: product.quantity,
              });
            }}
            className="flex-1 h-12 border-2 border-[#000a1e] text-[#000a1e] rounded-xl font-bold text-[16px] leading-6 hover:bg-[#002147] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={() => router.push(`/checkout?productId=${params.id}`)}
            className="flex-1 h-12 bg-[#fdc34d] text-[#715000] rounded-xl font-bold text-[16px] leading-6 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
