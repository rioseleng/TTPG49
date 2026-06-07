import { create } from "zustand";

type MockRole = "BUYER" | "SELLER";

interface MockUser {
  id: string;
  role: MockRole;
  fullName: string;
  email: string;
}

interface AuthState {
  user: MockUser | null;
  login: (role: MockRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (role) =>
    set({
      user: {
        id: "mock-user-1",
        role,
        fullName: role === "SELLER" ? "Alice Seller" : "Bob Buyer",
        email:
          role === "SELLER"
            ? "alice.seller@utp.edu.my"
            : "bob.buyer@utp.edu.my",
      },
    }),
  logout: () => set({ user: null }),
}));
