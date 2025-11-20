"use client";

import { ChevronDown, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatOrderStatus } from "@/lib/order-utils";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  total: number;
  status: string;
  paymentMethod: string;
  estimatedTime: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { updateQuantity } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("無法載入訂單歷史");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      // 將訂單中的每個項目加回購物車
      for (const item of order.items) {
        updateQuantity(item.productId, item.quantity, {
          name: item.productName,
          description: "",
          price: item.price,
          image: item.image,
        });
      }
      
      // 導航到購物車頁面
      router.push("/cart");
    } catch (error) {
      console.error("Error reordering:", error);
      alert("重新訂購失敗，請稍後再試");
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day}    ${hours}:${minutes}`;
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
        <h1 className="text-xl font-bold text-[#333333]">Order History</h1>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </header>

      {/* Orders List */}
      <main className="flex-1 px-4 pb-8 pt-12 max-w-md mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-base text-[#666666] text-center">載入中...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-base text-red-500 text-center mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="text-[#ed9c2a] font-semibold"
            >
              重試
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-base text-[#666666] text-center">
              尚無訂單
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#f8f3ec] rounded-2xl p-4 transition-all"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between py-1">
                  <span className="text-sm text-[#666666] leading-5">
                    {formatDate(order.createdAt)}
                  </span>
                  <button
                    onClick={() => handleReorder(order)}
                    className="bg-[#ed9c2a] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#d88a24] transition-colors"
                  >
                    Reorder
                  </button>
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-[#666666] leading-5">
                    ${order.total.toFixed(2)}
                  </span>
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-[#efe5d5] rounded transition-colors"
                  >
                    <ChevronDown
                      className={`w-6 h-6 text-[#666666] transition-transform ${
                        expandedOrderId === order.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Expanded Order Details */}
                {expandedOrderId === order.id && (
                  <div className="mt-4 pt-4 border-t border-[#f2e6d9] space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#666666]">
                        Order {order.orderNumber}
                      </span>
                      <span className="text-xs font-semibold text-[#ed9c2a]">
                        {formatOrderStatus(order.status)}
                      </span>
                    </div>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-1"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm text-[#333333] font-medium">
                            {item.productName}
                          </span>
                          <span className="text-xs text-[#666666]">
                            x {item.quantity}
                          </span>
                        </div>
                        <span className="text-sm text-[#333333] font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
