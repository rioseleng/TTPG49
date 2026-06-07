"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function SellerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user || user.role !== "SELLER") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user || user.role !== "SELLER") {
    return null;
  }

  return <>{children}</>;
}
