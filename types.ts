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
