"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/profile", icon: UserCircle, label: "Profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto border-t border-border bg-background/80 backdrop-blur-md pb-safe">
      <div className="flex h-16 items-center justify-around">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-5 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
