"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  nameZh?: string | null;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const router = useRouter();
  const [category, setCategory] = useState<string>("DRINK");
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const cartMap: { [key: string]: number } = {};
        parsedCart.forEach((item: { productId: string; quantity: number }) => {
          cartMap[item.productId] = item.quantity;
        });
        setCartItems(cartMap);
        setTotalItems(Object.values(cartMap).reduce((sum, qty) => sum + qty, 0));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Update cart count in header
  useEffect(() => {
    const wrapper = document.getElementById("cart-button-wrapper");
    if (!wrapper) return;

    // Create cart button
    const button = document.createElement("button");
    button.className =
      "p-2 hover:bg-gray-100 rounded-lg transition relative";
    button.onclick = () => router.push("/cart");

    // Create shopping cart icon
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "w-6 h-6 text-gray-700");
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke", "currentColor");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-width", "2");
    path.setAttribute(
      "d",
      "M3 3h2l.4 2M7 13h10l4-8H5.4M7 20a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
    );
    svg.appendChild(path);
    button.appendChild(svg);

    // Create or update cart count badge
    let countBadge = button.querySelector("#cart-count-badge") as HTMLElement | null;
    if (!countBadge) {
      countBadge = document.createElement("span");
      countBadge.id = "cart-count-badge";
      countBadge.className =
        "absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center";
      button.appendChild(countBadge);
    }

    if (totalItems > 0) {
      countBadge.textContent = totalItems.toString();
      countBadge.style.display = "flex";
    } else {
      countBadge.style.display = "none";
    }

    wrapper.innerHTML = "";
    wrapper.appendChild(button);
  }, [totalItems, router]);

  const filteredProducts = products.filter((product) => product.category === category);

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = filteredProducts.find((p) => p.id === productId);
    if (!product) return;

    const updated = { ...cartItems };
    if (quantity <= 0) {
      delete updated[productId];
    } else {
      updated[productId] = quantity;
    }
    setCartItems(updated);

    // Save to localStorage with complete product information
    const cartArray = Object.entries(updated).map(([productId, quantity]) => {
      const prod = products.find((p) => p.id === productId);
      return {
        productId,
        quantity,
        name: prod?.name || "",
        price: prod?.price || 0,
      };
    });
    localStorage.setItem("cart", JSON.stringify(cartArray));

    // Update total items
    const newTotal = Object.values(updated).reduce((sum, qty) => sum + qty, 0);
    setTotalItems(newTotal);
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <>
      {/* Category Tabs */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["DRINK", "MAIN", "SIDE"].map((cat) => {
          const labels: { [key: string]: string } = {
            DRINK: "⭐ Drinks",
            MAIN: "☀️ Main",
            SIDE: "🌙 Side",
          };
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={cartItems[product.id] || 0}
            onQuantityChange={(qty: number) => handleQuantityChange(product.id, qty)}
          />
        ))}
      </div>

      {/* No Products Message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products available in this category</p>
        </div>
      )}

      {/* Total Summary */}
      {totalItems > 0 && (
        <div
          onClick={handleCartClick}
          className="bg-gray-50 rounded-lg p-6 fixed bottom-0 left-0 right-0 border-t border-gray-200 cursor-pointer hover:bg-gray-100 transition"
        >
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <span className="text-xl font-semibold text-gray-900">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
            <span className="text-sm text-gray-600">Click to view cart →</span>
          </div>
        </div>
      )}
    </>
  );
}
