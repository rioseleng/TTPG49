import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductListing } from "@/types";

interface ProductCardProps {
  product: ProductListing;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuthStore();
  const { wishlistIds, toggle } = useWishlistStore();
  const isLiked = wishlistIds.has(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggle(user.id, product.id);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group h-full overflow-hidden bg-white rounded-lg shadow-[0px_4px_12px_rgba(0,33,71,0.08)] transition-all hover:shadow-[0px_8px_24px_rgba(0,33,71,0.12)] hover:-translate-y-0.5 active:scale-[0.98]">
        <div className="relative aspect-square w-full bg-[#f3f3f4] flex items-center justify-center text-4xl">
          {product.category === "FOOD" && "🍪"}
          {product.category === "CLOTHING" && "👕"}
          {product.category === "ACCESSORIES" && "⌚"}
          {product.category === "OTHER" && "📦"}
          <button
            type="button"
            onClick={handleToggle}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm transition-transform active:scale-90"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isLiked ? "fill-red-500 text-red-500" : "text-slate-500"
              }`}
            />
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#002147] text-white shadow-[0px_2px_6px_rgba(0,33,71,0.15)] transition-transform active:scale-90"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Add to cart</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
