"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, TrendingUp, Edit3 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toProductListing } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { ProductListing } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍪",
  CLOTHING: "👕",
  ACCESSORIES: "⌚",
  OTHER: "📦",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, refreshSession } = useAuthStore();
  const [myProducts, setMyProducts] = useState<ProductListing[]>([]);

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
          setMyProducts((data ?? []).map(toProductListing));
        });
    };

    fetchProducts();

    const channel = supabase
      .channel("dashboard")
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

  const totalSales = myProducts
    .filter((p) => !p.isAvailable)
    .reduce((sum, p) => sum + p.price, 0);

  const activeListings = myProducts.filter((p) => p.isAvailable).length;

  const pendingOrders = 3;
  const profileVisits = 482;

  return (
    <div className="flex flex-col pb-8">
      <div className="px-4 pt-6 pb-4">
        <div>
          <h2 className="font-headline text-headline-md text-[#002147]">
            Dashboard Overview
          </h2>
          <p className="text-on-surface-variant font-body text-body-md">
            Your sales performance this month
          </p>
        </div>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-[#fdc34d]">
            <p className="text-on-surface-variant font-label text-label-md uppercase tracking-wider mb-1">
              Total Sales
            </p>
            <p className="font-headline text-headline-lg text-[#002147]">
              RM {totalSales.toFixed(2)}
            </p>
            <div className="flex items-center text-green-600 text-sm font-semibold mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12%
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-[#000a1e]">
            <p className="text-on-surface-variant font-label text-label-md uppercase tracking-wider mb-1">
              Active Items
            </p>
            <p className="font-headline text-headline-lg text-[#002147]">
              {activeListings}
            </p>
            <p className="text-on-surface-variant text-sm mt-1">
              Across {new Set(myProducts.map((p) => p.category)).size} categories
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-[#002147]">
            <p className="text-on-surface-variant font-label text-label-md uppercase tracking-wider mb-1">
              Profile Visits
            </p>
            <p className="font-headline text-headline-lg text-[#002147]">
              {profileVisits}
            </p>
            <div className="flex items-center text-green-600 text-sm font-semibold mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5%
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-[#fdc34d]">
            <p className="text-on-surface-variant font-label text-label-md uppercase tracking-wider mb-1">
              Pending Orders
            </p>
            <p className="font-headline text-headline-lg text-[#fdc34d]">
              {pendingOrders}
            </p>
            <p className="text-on-surface-variant text-sm mt-1">
              Requires action
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline text-headline-md text-[#002147]">
            Manage Listings
          </h2>
          <Link
            href="/dashboard/products"
            className="text-[#715000] font-semibold font-label text-label-md hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {myProducts.slice(0, 2).map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow-card border border-[#c4c6cf] flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-lg bg-[#e2e2e2] flex-shrink-0 overflow-hidden border border-[#c4c6cf] flex items-center justify-center text-2xl">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : CATEGORY_ICONS[product.category] || "📦"}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="min-w-0">
                    <p className="font-bold text-[#000a1e] font-headline text-headline-sm truncate">
                      {product.title}
                    </p>
                    <span className="bg-[#000a1e]/5 text-[#000a1e] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                      {product.category}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2">
                    {product.isAvailable ? "Active" : "Sold"}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-3">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                        Qty
                      </p>
                      <p className="font-semibold text-[#1a1c1c]">{product.quantity ?? 1}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                        Price
                      </p>
                      <p className="font-bold text-[#715000]">
                        RM {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                    className="text-on-surface-variant hover:text-[#000a1e] transition-colors p-2 bg-[#f3f3f4] rounded-full"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => router.push("/dashboard/products/add")}
            className="bg-[#fdc34d] text-[#715000] font-bold py-4 px-6 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 text-sm uppercase tracking-wider"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );
}
