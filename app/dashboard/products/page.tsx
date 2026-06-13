"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { toProductListing } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { ProductListing } from "@/types";

export default function DashboardProductsPage() {
  const router = useRouter();
  const { user, loading, refreshSession } = useAuthStore();
  const [sellerProducts, setSellerProducts] = useState<ProductListing[]>([]);

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    if (loading) return;

    const supabase = createClient();

    const fetchProducts = () => {
      supabase
        .from("product_listings")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setSellerProducts((data ?? []).map(toProductListing));
        });
    };

    fetchProducts();

    const channel = supabase
      .channel("dashboard-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_listings" },
        () => {
          fetchProducts();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loading, user]);

  return (
    <div className="flex flex-col pb-8">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-headline-md text-[#002147]">
              My Products
            </h2>
            <p className="text-on-surface-variant font-body text-body-md">
              Manage your product listings
            </p>
          </div>
          <Link
            href="/dashboard/products/add"
            className="bg-[#fdc34d] text-[#715000] font-bold px-4 py-2 rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all text-sm uppercase tracking-wider"
          >
            Add New
          </Link>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {sellerProducts.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant font-body text-body-md">
            No products yet. Click &quot;Add New Product&quot; to get started.
          </div>
        )}
        {sellerProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-xl shadow-card border border-[#c4c6cf] flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-lg bg-[#e2e2e2] flex-shrink-0 overflow-hidden border border-[#c4c6cf] flex items-center justify-center text-xl">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
              ) : product.category === "FOOD" ? "🍪" : product.category === "CLOTHING" ? "👕" : product.category === "ACCESSORIES" ? "⌚" : "📦"}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <p className="font-bold text-[#000a1e] font-headline text-headline-sm truncate">
                    {product.title}
                  </p>
                  <p className="text-on-surface-variant text-xs mt-0.5">
                    {product.category}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 ${product.isAvailable ? "bg-green-100 text-green-700" : "bg-[#e2e2e2] text-[#44474e]"}`}>
                  {product.isAvailable ? "Active" : "Sold"}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="font-bold text-[#715000]">
                  RM {product.price.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                    className="text-[#000a1e] font-bold text-sm hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
