export interface UserProfile {
  id: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  fullName: string;
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
  category: "FOOD" | "CLOTHING" | "ACCESSORIES" | "SERVICES" | "OTHER";
  images: string[];
  createdAt: Date;
  isAvailable: boolean;
}
