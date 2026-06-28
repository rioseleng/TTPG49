"use client";

import { MessageCircle } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

export function ChatButton({ onClick }: { onClick: () => void }) {
  const unreadTotals = useChatStore((s) => s.unreadTotals);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center active:scale-95 transition-transform"
      aria-label="Messages"
    >
      <MessageCircle className="h-5 w-5 text-white" />
      {unreadTotals > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
          {unreadTotals > 9 ? "9+" : unreadTotals}
        </span>
      )}
    </button>
  );
}
