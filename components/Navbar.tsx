"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="w-10" />

        <Link href="/" className="text-lg font-semibold tracking-tight">
          UTPreneurs
        </Link>

        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
