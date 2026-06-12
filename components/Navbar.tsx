"use client";

import Link from "next/link";
import { Store } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 mx-auto max-w-md bg-[#002147] shadow-[0_4px_12px_rgba(0,33,71,0.08)]">
      <div className="flex h-14 items-center justify-center px-4">
        <div className="flex select-none items-center gap-2">
          <Store className="h-6 w-6 text-[#fdc34d]" />
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            UTPreneurs
          </Link>
        </div>
      </div>
    </header>
  );
}
