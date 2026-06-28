export const TIER_CONFIG = {
  FREE: {
    label: "Free",
    canSell: false,
    maxProducts: 0,
    price: 0,
  },
  PREMIUM: {
    label: "Premium",
    canSell: true,
    maxProducts: Infinity,
    price: 25,
    currency: "RM",
    perks: [
      "Unlimited product listings",
      "Seller dashboard & analytics",
      "Order management",
      "Delivery proof tracking",
      "Priority support",
      "Featured badge on listings",
    ],
  },
} as const;
