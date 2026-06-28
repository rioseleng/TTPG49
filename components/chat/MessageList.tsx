"use client";

import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChevronDown } from "lucide-react";
import type { Message } from "@/types";

export function MessageList({
  messages,
  currentUserId,
  isLoading,
}: {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [prevLength, setPrevLength] = useState(0);

  useEffect(() => {
    if (messages.length > prevLength && isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setPrevLength(messages.length);
  }, [messages.length, isAtBottom, prevLength]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#002147] border-t-transparent" />
          <p className="text-xs text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          message={msg}
          isOwn={msg.senderId === currentUserId}
        />
      ))}
      <div ref={bottomRef} />

      {!isAtBottom && messages.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-white border border-gray-200 shadow-lg px-4 py-2 text-xs text-gray-500 transition-all active:scale-95"
        >
          <ChevronDown className="h-3 w-3" />
          New messages
        </button>
      )}
    </div>
  );
}
