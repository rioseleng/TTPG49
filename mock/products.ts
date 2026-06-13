import { ProductListing } from "@/types";

export const MOCK_PRODUCTS: ProductListing[] = [
  {
    id: "1",
    sellerId: "seller-1",
    title: "Homemade Chocolate Cookies",
    description:
      "Freshly baked chocolate chip cookies, perfect for study snacks. Halal certified ingredients used.",
    price: 8.0,
    category: "FOOD",
    images: ["/mock/cookies.jpg"],
    quantity: 1,
    createdAt: new Date("2026-06-01"),
    isAvailable: true,
  },
  {
    id: "2",
    sellerId: "seller-1",
    title: "UTP Hoodie - Navy Blue",
    description:
      "Official UTP hoodie, navy blue, size L. Lightly worn, in excellent condition.",
    price: 45.0,
    category: "CLOTHING",
    images: ["/mock/hoodie.jpg"],
    quantity: 1,
    createdAt: new Date("2026-05-28"),
    isAvailable: true,
  },
  {
    id: "3",
    sellerId: "seller-2",
    title: "Casio Scientific Calculator fx-570EX",
    description:
      "Used for one semester only. Fully functional, comes with original box and manual.",
    price: 55.0,
    category: "ACCESSORIES",
    images: ["/mock/calculator.jpg"],
    quantity: 1,
    createdAt: new Date("2026-05-25"),
    isAvailable: true,
  },
  {
    id: "5",
    sellerId: "seller-3",
    title: "Nasi Lemak with Fried Chicken",
    description:
      "Authentic Malaysian nasi lemak with crispy fried chicken. Order before 10 AM for lunch delivery.",
    price: 7.0,
    category: "FOOD",
    images: ["/mock/nasilemak.jpg"],
    quantity: 1,
    createdAt: new Date("2026-06-02"),
    isAvailable: true,
  },
  {
    id: "6",
    sellerId: "seller-3",
    title: "Study Notes - Thermodynamics",
    description:
      "Comprehensive handwritten notes covering all chapters. Perfect for exam prep.",
    price: 25.0,
    category: "OTHER",
    images: ["/mock/notes.jpg"],
    quantity: 1,
    createdAt: new Date("2026-05-30"),
    isAvailable: false,
  },
  {
    id: "7",
    sellerId: "seller-1",
    title: "Handmade Beaded Bracelet",
    description:
      "Unique handmade bracelet with UTP colors. Adjustable size, great as a gift.",
    price: 12.0,
    category: "ACCESSORIES",
    images: ["/mock/bracelet.jpg"],
    quantity: 1,
    createdAt: new Date("2026-06-03"),
    isAvailable: true,
  },
];
