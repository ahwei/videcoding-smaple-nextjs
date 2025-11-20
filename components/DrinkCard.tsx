import { Button } from "@/components/ui/button";

interface DrinkCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  calories: number;
}

export function DrinkCard({ id, name, description, price, image, calories }: DrinkCardProps) {
  const handleAddToCart = () => {
    console.log(`Added ${name} to cart`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-2 flex-grow line-clamp-2">{description}</p>
        <p className="text-xs text-gray-500 mb-4">{calories} 卡路里</p>

        {/* Footer: Price and Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-2xl font-bold text-orange-600">${price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            size="sm"
          >
            加入購物車
          </Button>
        </div>
      </div>
    </div>
  );
}
