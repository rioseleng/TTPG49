"use client";

import { useEffect } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatStore } from "@/store/chat-store";
import { useAuthStore } from "@/store/auth-store";
import { ArrowLeft } from "lucide-react";
import type { Conversation } from "@/types";

export function ChatWindow({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const messages = useChatStore((s) => s.messages);
  const isLoadingMessages = useChatStore((s) => s.isLoadingMessages);
  const isSending = useChatStore((s) => s.isSending);
  const openConversationAction = useChatStore((s) => s.openConversation);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const subscribeToConversation = useChatStore((s) => s.subscribeToConversation);
  const user = useAuthStore((s) => s.user);

  const convoMessages = messages[conversation.id] ?? [];
  const currentUserId = user?.id ?? "00000000-0000-0000-0000-000000000001";

  useEffect(() => {
    openConversationAction(conversation.id);
    const unsub = subscribeToConversation(conversation.id);

    return () => {
      unsub();
    };
  }, [conversation.id, openConversationAction, subscribeToConversation]);

  const handleSend = (content: string) => {
    sendMessage(conversation.id, content);
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-[#000a1e]" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002147] text-sm font-bold text-white">
          {(conversation.otherUserName || "?")[0].toUpperCase()}
        </div>
        <span className="text-sm font-semibold text-[#000a1e]">
          {conversation.otherUserName ?? "Unknown"}
        </span>
      </div>

      <MessageList
        messages={convoMessages}
        currentUserId={currentUserId}
        isLoading={isLoadingMessages}
      />

      <ChatInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
