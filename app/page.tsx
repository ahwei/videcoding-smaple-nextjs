"use client";

import { useState } from "react";
import { DrinkListItem } from "@/components/DrinkListItem";
import { drinks } from "@/data/drinks";
import { ShoppingCart, Heart } from "lucide-react";

export default function Home() {
  const [category, setCategory] = useState<"popular" | "breakfast" | "dinner">("popular");
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  const filteredDrinks = drinks.filter((drink) => drink.category === category);

  const handleQuantityChange = (drinkId: string, quantity: number) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[drinkId];
      } else {
        updated[drinkId] = quantity;
      }
      return updated;
    });
  };

  const totalPrice = Object.entries(cartItems).reduce((sum, [drinkId, quantity]) => {
    const drink = drinks.find((d) => d.id === drinkId);
    return sum + (drink ? drink.price * quantity : 0);
  }, 0);

  const totalItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Taiwanese Breakfast</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Heart className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-3 mb-8">
          {["popular", "breakfast", "dinner"].map((cat) => {
            const labels: { [key: string]: string } = {
              popular: "⭐ Most popular",
              breakfast: "☀️ Breakfast",
              dinner: "🌙 Dinner",
            };
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat as any)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  category === cat
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {labels[cat]}
              </button>
            );
          })}
        </div>

        {/* Drinks List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDrinks.map((drink) => (
            <DrinkListItem
              key={drink.id}
              drink={drink}
              quantity={cartItems[drink.id] || 0}
              onQuantityChange={(qty) => handleQuantityChange(drink.id, qty)}
            />
          ))}
        </div>

        {/* Total */}
        {Object.keys(cartItems).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 fixed bottom-0 left-0 right-0 border-t border-gray-200">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
