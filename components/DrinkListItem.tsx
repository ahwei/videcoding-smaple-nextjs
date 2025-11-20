import { Drink } from "@/data/drinks";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface DrinkListItemProps {
  drink: Drink;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function DrinkListItem({ drink, quantity, onQuantityChange }: DrinkListItemProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 flex flex-col h-full">
      {/* Image */}
      <div className="mb-3">
        <img
          src={drink.image}
          alt={drink.name}
          className="w-full h-32 rounded-xl object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content Wrapper */}
      <div className="flex-grow flex flex-col">
        {/* Name and Description */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{drink.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{drink.description}</p>
          <p className="text-xs text-gray-500 mt-1">{drink.calories} cal.</p>
        </div>

        {/* Price and Controls */}
        <div className="flex items-end justify-between mt-auto">
          <span className="text-2xl font-bold text-gray-900">${drink.price.toFixed(2)}</span>

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
