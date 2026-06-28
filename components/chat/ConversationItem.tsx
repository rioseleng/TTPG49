"use client";

import type { Conversation } from "@/types";

function formatTime(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString("en-MY", { day: "numeric", month: "short" });
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const initial = (conversation.otherUserName || "?")[0].toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors active:scale-[0.99] ${
        isActive
          ? "bg-[#002147]/5"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#002147] text-sm font-bold text-white">
        {initial}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#000a1e] truncate">
            {conversation.otherUserName ?? "Unknown"}
          </span>
          <span className="text-[10px] text-gray-400 shrink-0 ml-2">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-gray-500 truncate">
            {conversation.lastMessage ?? "No messages yet"}
          </span>
          {(conversation.unreadCount ?? 0) > 0 && (
            <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shrink-0">
              {conversation.unreadCount! > 9
                ? "9+"
                : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
