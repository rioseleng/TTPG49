"use client";

import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const hideNavbar = useUIStore((s) => s.hideNavbar);
  const hideBottomNav = useUIStore((s) => s.hideBottomNav);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main
        className={cn(
          hideNavbar ? "" : "pt-14",
          hideBottomNav ? "" : "pb-24",
        )}
      >
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
