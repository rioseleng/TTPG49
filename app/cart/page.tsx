import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold">Your Cart is Empty</h1>
      <p className="max-w-sm text-muted-foreground">
        Products you add to your cart will appear here. Start exploring the
        marketplace!
      </p>
    </div>
  );
}
