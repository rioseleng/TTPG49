"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/mock/products";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍪",
  CLOTHING: "👕",
  ACCESSORIES: "⌚",
  SERVICES: "🎯",
  OTHER: "📦",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-6xl">🔍</p>
        <h1 className="mb-2 text-2xl font-bold">Product not found</h1>
        <p className="mb-6 text-muted-foreground">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        &larr; Back
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-8xl">
          {CATEGORY_ICONS[product.category] || "📦"}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.title}
            </h1>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              RM {product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                product.isAvailable ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {product.isAvailable ? "In Stock" : "Sold"}
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            <Button size="lg" className="flex-1">
              Buy Now
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
