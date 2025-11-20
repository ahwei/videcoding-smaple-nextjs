"use client";

import { useCart } from "@/lib/cart-context";
import { Check, ChevronLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "apple">(
    "credit",
  );
  const [selectedCard, setSelectedCard] = useState<"mastercard" | "visa">(
    "mastercard",
  );
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      // 準備訂單項目資料
      const orderItems = cartItems
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

      if (orderItems.length === 0) {
        alert("購物車是空的");
        return;
      }

      // 決定付款方式
      let paymentMethodType;
      if (paymentMethod === "apple") {
        paymentMethodType = "APPLE_PAY";
      } else {
        paymentMethodType = selectedCard === "mastercard" ? "MASTERCARD" : "VISA";
      }

      // 調用 API 創建訂單
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderItems,
          paymentMethod: paymentMethodType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      const orderNumber = data.order.orderNumber;

      // Clear the cart
      clearCart();

      // Navigate to thank you page with order number
      router.push(`/thank-you?order=${orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("訂單創建失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-xl font-bold text-[#333333]">Checkout</h1>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8 max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="py-8 px-6">
          <h2 className="text-base font-extrabold text-[#1f2024] mb-2.5">
            Choose a payment method
          </h2>
          <p className="text-xs text-[#71727a] leading-4">
            You won&apos;t be charged until you review the order on the next
            page
          </p>
        </div>

        {/* Payment Options */}
        <div className="space-y-4 px-4">
          {/* Credit Card Option */}
          <div className="border border-[#d4d6dd] rounded-2xl p-4">
            {/* Credit Card Radio */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setPaymentMethod("credit")}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  paymentMethod === "credit"
                    ? "border-[#ed9c2a] bg-[#ed9c2a]"
                    : "border-[#c5c6cc] bg-white"
                }`}
              >
                {paymentMethod === "credit" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>
              <span className="text-xs font-bold text-[#71727a]">
                Credit Card
              </span>
            </div>

            {/* Credit Card List */}
            {paymentMethod === "credit" && (
              <div className="space-y-2">
                {/* Mastercard */}
                <button
                  onClick={() => setSelectedCard("mastercard")}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
                    selectedCard === "mastercard"
                      ? "bg-[#f8f3ec]"
                      : "border border-[#c5c6cc]"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-[#1f2024] font-normal">
                      Mastercard
                    </span>
                    <span className="text-xs text-[#71727a]">
                      xxxx xxxx xxxx 1234
                    </span>
                  </div>
                  {selectedCard === "mastercard" && (
                    <Check className="w-3 h-3 text-[#ed9c2a]" strokeWidth={3} />
                  )}
                </button>

                {/* Visa */}
                <button
                  onClick={() => setSelectedCard("visa")}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
                    selectedCard === "visa"
                      ? "bg-[#f8f3ec]"
                      : "border border-[#c5c6cc]"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-[#1f2024] font-normal">
                      Visa
                    </span>
                    <span className="text-xs text-[#71727a]">
                      xxxx xxxx xxxx 9876
                    </span>
                  </div>
                  {selectedCard === "visa" && (
                    <Check className="w-3 h-3 text-[#ed9c2a]" strokeWidth={3} />
                  )}
                </button>

                {/* Add New Card Button */}
                <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors w-full">
                  <Plus className="w-3 h-3 text-[#ed9c2a]" strokeWidth={3} />
                  <span className="text-xs font-semibold text-[#ed9c2a]">
                    Add new card
                  </span>
                </button>

                {/* Billing Address Checkbox */}
                <div className="flex items-start gap-3 px-3 pt-4">
                  <button
                    onClick={() => setSameAsBilling(!sameAsBilling)}
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      sameAsBilling
                        ? "bg-[#ed9c2a] border-[#ed9c2a] border-2"
                        : "border-[#c5c6cc] border-2"
                    }`}
                  >
                    {sameAsBilling && (
                      <Check
                        className="w-2.5 h-2.5 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                  <span className="text-xs text-[#71727a] leading-4">
                    My billing address is the same as my shipping address
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Apple Pay Option */}
          <div className="border border-[#d4d6dd] rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaymentMethod("apple")}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  paymentMethod === "apple"
                    ? "border-[#ed9c2a] bg-[#ed9c2a]"
                    : "border-[#c5c6cc] bg-white"
                }`}
              >
                {paymentMethod === "apple" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>
              <span className="text-xs font-bold text-[#71727a]">
                Apple Pay
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Continue Button */}
      <footer className="border-t border-gray-200 bg-[#fefefe] backdrop-blur-sm px-4 py-8 max-w-md mx-auto w-full">
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full bg-[#ed9c2a] text-white font-bold text-base py-3 px-6 rounded-full hover:bg-[#d88a24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "處理中..." : "Continue"}
        </button>
      </footer>
    </div>
  );
}
