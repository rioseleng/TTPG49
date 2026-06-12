"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, UserCircle } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

const TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/profile", icon: UserCircle, label: "Profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const cartItemCount = useUIStore((s) => s.cartItemCount);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto border-t border-slate-200 bg-white/80 backdrop-blur-md pb-safe">
      <div className="flex h-16 items-center justify-around px-4">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const isCart = tab.href === "/cart";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center ${
                isActive
                  ? "bg-amber-400 text-slate-950 rounded-2xl px-4 py-2 font-bold text-xs"
                  : "gap-0.5 px-5 py-2 text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className={isActive ? "" : "text-xs font-medium"}>
                {tab.label}
              </span>
              {isCart && cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
