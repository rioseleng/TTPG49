import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ProductListing } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Maps Supabase snake_case row to camelCase ProductListing */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toProductListing(row: any): ProductListing {
  return {
    id: row.id as string,
    sellerId: (row.seller_id ?? row.sellerId) as string,
    title: row.title as string,
    description: (row.description ?? "") as string,
    price: row.price as number,
    category: row.category as ProductListing["category"],
    images: (row.images ?? []) as string[],
    quantity: (row.quantity ?? 1) as number,
    createdAt: new Date((row.created_at ?? row.createdAt) as string),
    isAvailable: (row.is_available ?? row.isAvailable) as boolean,
  };
}
