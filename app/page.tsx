import { Suspense } from "react";
import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/ProductGrid";
import { ShoppingCart, Heart } from "lucide-react";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Convert Decimal to number for client-side serialization
    return products.map((product) => ({
      ...product,
      price: parseFloat(product.price.toString()),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Taiwanese Breakfast</h1>
          <div className="flex items-center gap-4">
            <a 
              href="/orders"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
            >
              訂單歷史
            </a>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Heart className="w-6 h-6 text-gray-700" />
            </button>
            <div id="cart-button-wrapper"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} />
        </Suspense>
      </main>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 rounded-2xl h-48 animate-pulse"
        />
      ))}
    </div>
  );
}
