export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: "FREE" | "PREMIUM";
  universityId?: string;
  createdAt: Date;
}

export interface PremiumSubscription {
  id: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  buyerId: string;
  sellerId: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
  otherUserName?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessageRead {
  userId: string;
  conversationId: string;
  lastReadAt: string;
}

export interface ProductListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: "FOOD" | "CLOTHING" | "ACCESSORIES" | "OTHER";
  images: string[];
  quantity: number;
  createdAt: Date;
  isAvailable: boolean;
}
