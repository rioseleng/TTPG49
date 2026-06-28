"use client";

import { ConversationItem } from "./ConversationItem";
import { MessageCircle } from "lucide-react";
import type { Conversation } from "@/types";

export function ConversationList({
  conversations,
  activeId,
  isLoading,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-1 px-4 py-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
              <div className="h-2.5 w-48 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
        <MessageCircle className="h-12 w-12 text-gray-300" />
        <p className="text-sm text-gray-400">No conversations yet</p>
        <p className="text-xs text-gray-300 text-center max-w-[200px]">
          Tap &ldquo;Message Seller&rdquo; on a product to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeId}
          onClick={() => onSelect(conv.id)}
        />
      ))}
    </div>
  );
}
