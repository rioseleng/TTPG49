export interface UserProfile {
  id: string;
  name: string;
  email: string;
  universityId?: string;
  createdAt: Date;
}

export interface SellerSubscription {
  sellerId: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  tier: "BASIC" | "PREMIUM";
  expiresAt: Date;
}

export interface ProductListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: "FOOD" | "CLOTHING" | "ACCESSORIES" | "OTHER";
  images: string[];
  createdAt: Date;
  isAvailable: boolean;
}
