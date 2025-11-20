"use client";

import { Plus, Minus } from "lucide-react";

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

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductCard({ product, quantity, onQuantityChange }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 flex flex-col h-full border border-gray-200">
      {/* Image */}
      <div className="mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 rounded-xl object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content Wrapper */}
      <div className="flex-grow flex flex-col">
        {/* Name and Description */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
          {product.nameZh && (
            <p className="text-sm text-gray-500">{product.nameZh}</p>
          )}
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>

        {/* Price and Controls */}
        <div className="flex items-end justify-between mt-auto">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>

          {/* Quantity Control */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              className="p-1 hover:bg-gray-200 rounded transition"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
            <span className="w-6 text-center font-semibold text-gray-900 text-sm">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="p-1 hover:bg-gray-200 rounded transition"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
