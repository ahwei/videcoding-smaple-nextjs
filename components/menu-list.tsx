"use client";

import { useCart } from "@/lib/cart-context";
import { ScrollText, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface MenuListProps {
  products: Product[];
}

export function MenuList({ products }: MenuListProps) {
  const router = useRouter();
  const { getQuantity, updateQuantity, totalItems, totalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState("popular");

  // Merge products with cart quantities
  const menuItems = products.map((product) => ({
    ...product,
    quantity: getQuantity(product.id),
  }));

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <div className="flex-1 flex flex-col gap-8 px-4 pt-8 pb-4 max-w-md mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#333333]">
            Taiwanese Breakfast
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/orders")}
              className="p-0.5 hover:opacity-70 transition-opacity"
            >
              <ScrollText className="w-6 h-6 text-[#1e293b]" />
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="relative p-0.5 hover:opacity-70 transition-opacity"
            >
              <ShoppingCart className="w-6 h-6 text-[#1e293b]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ed9c2a] text-white text-[10px] font-semibold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Category Navigation */}
        <nav className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory("popular")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === "popular"
                ? "bg-[#ed9c2a] text-white"
                : "bg-[#f8f3ec] text-[#333333]"
            }`}
          >
            <span className="text-base">🔥</span>
            Most popular
          </button>
          <button
            onClick={() => setActiveCategory("dinner")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === "dinner"
                ? "bg-[#ed9c2a] text-white"
                : "bg-[#f8f3ec] text-[#333333]"
            }`}
          >
            <span className="text-base">🌙</span>
            Dinner
          </button>
          <button
            onClick={() => setActiveCategory("breakfast")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === "breakfast"
                ? "bg-[#ed9c2a] text-white"
                : "bg-[#f8f3ec] text-[#333333]"
            }`}
          >
            <span className="text-base">☀️</span>
            Breakfast
          </button>
          <button
            onClick={() => setActiveCategory("drinks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === "drinks"
                ? "bg-[#ed9c2a] text-white"
                : "bg-[#f8f3ec] text-[#333333]"
            }`}
          >
            <span className="text-base">🥤</span>
            Drinks
          </button>
        </nav>

        {/* Menu Items */}
        <main className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <article
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex gap-4">
                  <div
                    className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-[#333333]">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#666666] leading-5">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-[#333333]">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(0, item.quantity - 1),
                              {
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                image: item.image,
                              }
                            )
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
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Total */}
          <div className="bg-[#f8f3ec] p-4 rounded-3xl">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#333333]">Total</span>
              <span className="text-base font-bold text-[#333333]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
