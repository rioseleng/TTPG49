markdown_content = """# UTPreneurs Progressive Web App (PWA) Product Requirements Document

## **1. App Overview**
* **App Name:** UTPreneurs
* **One-Sentence Pitch:** A centralized online marketplace platform allowing UTP students to promote and sell their products to students, staff, alumni, and external buyers.
* **Core Problem Solved:** Student sellers currently rely on scattered platforms like WhatsApp, Telegram, and Instagram, making it difficult for buyers to discover products and for sellers to reach a wider audience within the university community.

---

## **2. Tech Stack Strategy (Strict Constraints for AI)**
| Layer | Technology | Notes for AI Implementation |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (React) | Use the App Router for clean, server-side rendered routes and SEO optimization. |
| **Styling** | Tailwind CSS | Enforce utility-class styling strictly; use shadcn/ui for rapid, accessible component building. |
| **State Management** | Zustand | Keep global state lightweight; rely on React context for user sessions. |
| **PWA Implementation** | `@serwist/next` | Configure for offline fallbacks (e.g., `app/~offline/page.tsx`) and proper service worker registration by wrapping `next.config.mjs` with `withSerwist`. |
| **Database / Backend** | Supabase | Utilize PostgreSQL for relational data (users, products, subscriptions) and built-in Auth. |

---

## **3. Feature / Functional Scope (Detailed Specifications)**

### **Pages / Routes**
*   **`/`**: Marketplace Homepage (Wireframe: Search bar, category pills, product grid).
*   **`/login` & `/register`**: Authentication pages.
*   **`/product/[id]`**: Dynamic product details page.
*   **`/checkout`**: Payment gateway flow.
*   **`/dashboard`**: Seller overview (Wireframe: Sales stats, active subscription status).
*   **`/dashboard/products`**: Seller product management (List view, Add/Edit forms).

### **User Flows**
*   **Authentication**: Login/Register with Supabase Auth (Email/Password or OAuth).
*   **CRUD Operations**: Sellers can Create, Read, Update, and Delete product listings. Buyers can Read listings.
*   **Offline → Online Reconciliation**: If a seller attempts to edit a product or a buyer favorites an item while offline, the action is queued locally and automatically synced to Supabase when the connection is restored.

### **API / Data**
*   **Endpoints**: Supabase auto-generated REST endpoints (PostgREST).
*   **Auth Tokens**: Managed via Supabase JWTs stored securely in HTTP-only cookies.
*   **Caching Headers**: Configure standard Next.js caching combined with Serwist caching strategies.

### **UI / UX**
*   **Responsive Breakpoints**: Standard Tailwind breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`). Mobile-first design approach.
*   **Skeleton Loaders**: Implement shadcn/ui skeletons while fetching product grids or dashboard data to prevent layout shift.
*   **Toast Notifications**: Global toasts triggered for system events, specifically notifying users of offline state (e.g., "You are currently offline. Browsing cached products.").

### **State Management & Offline Data**
*   **Client-Side Store**: Zustand for ephemeral UI state (e.g., mobile menu toggle, active filters).
*   **Offline Data Strategy**: Use the **Cache API** for static assets, UI shells, and product images. Use **IndexedDB** for queuing offline CRUD mutations (e.g., a seller updating stock while on a train).

### **Push Notifications**
*   **Subscription Flow**: Prompt buyers for notification permissions after their first successful checkout.
*   **Event Handling**: Service worker listens for push events triggered by Supabase edge functions (e.g., "Your order is ready").
*   **Notification UI**: Standard OS-level web push notifications with an in-app notification bell fallback.

### **Performance Budgets**
*   **First Contentful Paint (FCP)**: < 1.5s
*   **Time to Interactive (TTI)**: < 3s
*   **Lighthouse Targets**: > 90 Performance, 100/100 PWA Score.

---

## **4. Core Features & MVP Scope**
1.  **User Authentication & Account Management:** Buyers and sellers must be able to register, log in, and manage their profiles without error. 
2.  **Seller Dashboard & Subscription System:** Sellers require a dashboard to fully manage their listings and must be able to subscribe or pay to display their products. 
3.  **Search & Product Discovery:** The platform must provide an organized product listing system with search features that return accurate results for buyers. 
4.  **Payment Gateway Integration:** A secure checkout process must be implemented to allow buyers to purchase items conveniently. 

---

## **5. PWA Specific Requirements**
* **Responsive Design:** The system must be fully functional and responsive, displaying correctly across both mobile and desktop devices.
* **Web App Manifest:** Include properties for `name` ("UTPreneurs"), `short_name` ("UTPreneurs"), `start_url`, `display` (standalone), and a full set of icons (192x192, 512x512).
* **Service Worker Strategies:**
    * *Cache First:* For static assets (UTP logos, UI icons, CSS, JS).
    * *Network First (with cache fallback):* For the product marketplace and seller dashboard to ensure data freshness.
    * *Offline Fallback:* A custom offline UI instructing users to reconnect to browse the marketplace.
* **Installability:** Trigger the "Add to Home Screen" (A2HS) prompt for mobile users.

---

## **6. Data Models (Core Schema)**
```typescript
// User Entity (Buyers and Sellers)
interface UserProfile {
  id: string; // Supabase Auth UUID
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  fullName: string;
  email: string;
  universityId?: string; // Optional for external buyers
  createdAt: Date;
}

// Seller Subscription details
interface SellerSubscription {
  sellerId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  tier: 'BASIC' | 'PREMIUM';
  expiresAt: Date;
}

// Product Listing Entity
interface ProductListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: 'FOOD' | 'CLOTHING' | 'ACCESSORIES' | 'SERVICES' | 'OTHER';
  images: string[]; // Array of URL strings
  createdAt: Date;
  isAvailable: boolean;
}


Phase 1: Foundation & PWA Setup. "Initialize the project using Next.js 14, Tailwind CSS, and Supabase. Set up the routing architecture, establish the global styling config, and implement the PWA manifest and service worker config using Serwist."

Phase 2: Authentication & User Roles. "Implement Supabase authentication for users. Create the routing logic to separate regular buyers from the Seller Dashboard views."

Phase 3: UI Shell & Marketplace Discovery. "Build the responsive layout shell (mobile navigation and desktop sidebar). Implement the marketplace homepage, search functionality, and product discovery UI using mock data."

Phase 4: Seller Dashboard. "Build the Seller Dashboard allowing users to manage product listings. Connect these forms to the database schema."

Phase 5: Payments & Subscriptions. "Integrate the payment gateway for both buyer checkouts and seller subscription fees. Ensure all test transactions resolve correctly and update database statuses.

