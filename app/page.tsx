"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { MOCK_PRODUCTS } from "@/mock/products";
import { useUIStore } from "@/store/ui-store";

const CATEGORIES = [
  "ALL",
  "FOOD",
  "CLOTHING",
  "ACCESSORIES",
  "SERVICES",
  "OTHER",
] as const;

export default function HomePage() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } =
    useUIStore();

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesCategory =
        !activeCategory ||
        activeCategory === "ALL" ||
        product.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto w-full z-50 bg-background pb-2 border-b border-border">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="w-10" />

          <Link href="/" className="text-lg font-semibold tracking-tight">
            UTPreneurs
          </Link>

          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>

        <div className="px-4">
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
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setActiveCategory(cat === "ALL" ? null : cat)
                  }
                  className={cn(
                    buttonVariants({
                      variant:
                        activeCategory === cat ||
                        (!activeCategory && cat === "ALL")
                          ? "default"
                          : "outline",
                      size: "sm",
                    }),
                    "shrink-0 rounded-full text-xs h-7 px-3"
                  )}
                >
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="px-2 pt-[180px]">
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
