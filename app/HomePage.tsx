"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { MOCK_PRODUCTS } from "@/mock/products";
import { useUIStore } from "@/store/ui-store";

const CATEGORIES = [
  "ALL",
  "FOOD",
  "CLOTHING",
  "ACCESSORIES",
  "OTHER",
] as const;

const BASE_CLS =
  "inline-flex shrink-0 items-center justify-center text-sm font-medium whitespace-nowrap transition-colors select-none h-7 px-3 rounded-full text-xs";
const ACTIVE_CLS = "bg-primary text-primary-foreground";
const INACTIVE_CLS = "border border-border bg-background text-muted-foreground";

export default function HomePage() {
  const { searchQuery, setSearchQuery } = useUIStore();
  const [selected, setSelected] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return (MOCK_PRODUCTS?.filter((product) => {
      const matchCat =
        selected === null ||
        selected === "ALL" ||
        product.category === selected;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    })) || [];
  }, [searchQuery, selected]);

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="w-10" />
          <Link href="/" className="text-lg font-semibold tracking-tight">
            UTPreneurs
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pb-3">
          <h1 className="mb-0.5 text-xl font-bold tracking-tight">
            Marketplace
          </h1>
          <p className="mb-2 text-xs text-muted-foreground">
            Discover products from UTP students, staff, and alumni.
          </p>

          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />

          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-1.5">
              {CATEGORIES.map((cat) => {
                const active =
                  selected === cat || (selected === null && cat === "ALL");
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      console.log("Category clicked:", cat);
                      setSelected(cat === "ALL" ? null : cat);
                    }}
                    className={`${BASE_CLS} ${active ? ACTIVE_CLS : INACTIVE_CLS}`}
                  >
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 pt-3">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="mb-2 text-lg font-semibold">No products found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
