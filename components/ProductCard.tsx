import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type { ProductListing } from "@/types";

const CATEGORY_COLORS: Record<
  ProductListing["category"],
  string
> = {
  FOOD: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  CLOTHING: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  ACCESSORIES: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  OTHER: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

interface ProductCardProps {
  product: ProductListing;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="aspect-square w-full bg-muted">
            <div className="flex h-full items-center justify-center text-4xl">
              {product.category === "FOOD" && "🍪"}
              {product.category === "CLOTHING" && "👕"}
              {product.category === "ACCESSORIES" && "⌚"}
              {product.category === "OTHER" && "📦"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <Badge
            variant="secondary"
            className={`mb-1 text-[10px] px-1.5 py-0 ${CATEGORY_COLORS[product.category]}`}
          >
            {product.category}
          </Badge>
          <h3 className="truncate text-sm font-medium leading-tight">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold">
              RM {product.price.toFixed(2)}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-90"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Quick add</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
