"use client";

import { useCart } from "@/lib/cart-context";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items: cartItems, updateQuantity, totalPrice: subtotal } = useCart();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-8 max-w-md mx-auto w-full">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-[#333333]" />
        </button>
        <h1 className="text-xl font-bold text-[#333333]">Your Order</h1>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </header>

      {/* Cart Items */}
      <main className="flex-1 flex flex-col gap-6 px-4 pb-8 pt-12 max-w-md mx-auto w-full">
        <div className="flex flex-col gap-2">
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between py-4 ${
                index !== cartItems.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="text-base font-medium text-[#333333]">
                  {item.name}
                </span>
                <span className="text-sm text-[#666666]">
                  x {item.quantity}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(0, item.quantity - 1), {
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="w-8 h-8 rounded-full bg-[#f8f3ec] flex items-center justify-center text-[#333333] font-medium hover:bg-[#efe5d5] transition-colors"
                  >
                    -
                  </button>
                  <span className="text-base font-medium text-[#333333] min-w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1, {
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="w-8 h-8 rounded-full bg-[#f8f3ec] flex items-center justify-center text-[#333333] font-medium hover:bg-[#efe5d5] transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-base font-semibold text-[#333333] min-w-[60px] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-[#f8f3ec] p-4 rounded-2xl">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-[#666666]">Subtotal</span>
            <span className="text-sm text-[#666666]">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-[#666666]">
              Estimated Preparation Time
            </span>
            <span className="text-sm text-[#666666]">15-20 min</span>
          </div>
        </div>
      </main>

      {/* Footer with Checkout Button */}
      <footer className="border-t border-gray-200 bg-[#fefefe] backdrop-blur-sm px-4 py-8 max-w-md mx-auto w-full">
        <button
          onClick={() => router.push("/checkout")}
          className="w-full bg-[#ed9c2a] text-white font-bold text-base py-3 px-6 rounded-full hover:bg-[#d88a24] transition-colors"
        >
          Checkout
        </button>
      </footer>
    </div>
  );
}
