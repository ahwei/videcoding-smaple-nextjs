"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

const PREPARATION_TIME = "15-20 min";

export function CartContent() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      const updated = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const removeItem = (productId: string) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        alert("購物車是空的");
        return;
      }

      // Create order payload
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod: "CREDIT_CARD", // Default payment method
      };

      // Call API to create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      const order = await response.json();

      // Clear cart after successful order
      localStorage.removeItem("cart");

      // Navigate to order confirmation page or history
      alert(`訂單已建立！訂單號：${order.orderNumber}`);
      router.push("/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        `結帳失敗：${error instanceof Error ? error.message : "未知錯誤"}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Order</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <ShoppingCartEmpty className="w-16 h-16 mx-auto text-gray-300" />
            </div>
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <Button 
              onClick={() => router.push("/")} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="pb-32">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              {cartItems.map((item, index) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div key={item.productId} className={`p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">
                        ${itemTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition"
                        >
                          <Minus className="w-5 h-5 text-gray-700" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition"
                        >
                          <Plus className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-xl font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Estimated Preparation Time</span>
                <span className="text-lg font-semibold text-gray-900">{PREPARATION_TIME}</span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl shadow-sm p-6 mb-6 border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-orange-600">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
              <div className="max-w-2xl mx-auto px-4 py-4">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-4 rounded-full font-semibold transition-all hover:shadow-lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Empty Cart Icon
function ShoppingCartEmpty({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"
      />
    </svg>
  );
}
