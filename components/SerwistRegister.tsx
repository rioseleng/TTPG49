"use client";

import { useEffect } from "react";

export function SerwistRegister() {
  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      typeof window !== "undefined" &&
      window.serwist
    ) {
      window.serwist.register();
    }
  }, []);

  return null;
}
