"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <Navbar />}
      <main className={`pb-24 ${!isHome ? "pt-14" : ""}`}>
        {children}
      </main>
      <BottomNav />
    </>
  );
}
