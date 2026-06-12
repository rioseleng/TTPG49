"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import { useUIStore, CartItem } from "@/store/ui-store";
import { MOCK_PRODUCTS } from "@/mock/products";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍪",
  CLOTHING: "👕",
  ACCESSORIES: "⌚",
  OTHER: "📦",
};

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    productId: "1",
    title: (MOCK_PRODUCTS.find((p) => p.id === "1")?.title ?? "Cookies"),
    price: MOCK_PRODUCTS.find((p) => p.id === "1")?.price ?? 0,
    category: "FOOD",
    quantity: 2,
    image: "🍪",
  },
  {
    productId: "2",
    title: (MOCK_PRODUCTS.find((p) => p.id === "2")?.title ?? "Hoodie"),
    price: MOCK_PRODUCTS.find((p) => p.id === "2")?.price ?? 0,
    category: "CLOTHING",
    quantity: 1,
    image: "👕",
  },
];

export default function CartPage() {
  const router = useRouter();
  const cartItems = useUIStore((s) => s.cartItems);
  const addCartItem = useUIStore((s) => s.addCartItem);
  const removeCartItem = useUIStore((s) => s.removeCartItem);
  const updateCartItemQuantity = useUIStore((s) => s.updateCartItemQuantity);
  const seeded = useRef(false);

  if (!seeded.current && cartItems.length === 0) {
    seeded.current = true;
    INITIAL_CART_ITEMS.forEach((item) => addCartItem(item));
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const hasItems = cartItems.length > 0;

  return (
    <div className="flex flex-col pb-40">
      <div className="px-4 pt-6 pb-4">
        <h2 className="font-headline text-[28px] md:text-[32px] font-bold leading-9 md:leading-10 text-[#002147] mb-1">
          Shopping Cart
        </h2>
        <p className="font-body text-body-md text-[#44474e]">
          {hasItems
            ? "Confirm your items before proceeding to checkout."
            : "Your cart is waiting to be filled."}
        </p>
      </div>

      <div className="px-4 space-y-4">
        {hasItems ? (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl p-4 flex gap-4 shadow-[0px_4px_12px_rgba(0,33,71,0.08)] transition-all hover:opacity-95"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[#eeeeee] flex items-center justify-center text-3xl">
                {CATEGORY_ICONS[item.category] || "📦"}
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline text-headline-sm text-[#002147]">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => removeCartItem(item.productId)}
                      className="text-[#44474e] hover:text-[#ba1a1a] transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[#7b5800] font-bold mt-1">
                    RM {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-label text-label-md text-[#44474e] uppercase tracking-wider">
                    Quantity
                  </span>
                  <div className="flex items-center bg-[#eeeeee] rounded-full px-1 py-1">
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item.productId, -1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-[#002147] active:scale-90 transition-transform"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-[#002147]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item.productId, 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-[#002147] active:scale-90 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="text-[#c4c6cf] w-16 h-16 mb-4" style={{ strokeWidth: 1 }} />
            <p className="font-headline text-headline-sm text-[#1a1c1c] mb-1">
              Your cart is empty
            </p>
            <p className="font-body text-body-md text-[#44474e] mb-4">
              Products you add will appear here.
            </p>
            <Link
              href="/"
              className="font-bold text-[#002147] underline underline-offset-4"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>

      {hasItems && (
        <>
          <div className="px-4 mt-6 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[#c4c6cf]">
              <span className="text-[#44474e]">Subtotal</span>
              <span className="font-bold text-[#002147]">
                RM {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#c4c6cf]">
              <span className="text-[#44474e]">Shipping (Campus Hub)</span>
              <span className="text-[#44474e]">Free</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-headline text-headline-md text-[#002147]">
                Total
              </span>
              <span className="font-headline text-headline-md text-[#7b5800] font-bold">
                RM {subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto bg-white p-4 shadow-[0px_-4px_12px_rgba(0,33,71,0.08)]">
            <button
              onClick={() => router.push("/checkout")}
              className="w-full h-14 bg-[#fdc34d] text-[#002147] font-headline text-headline-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:opacity-90"
            >
              Checkout
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
