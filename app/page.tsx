import { prisma } from "@/lib/db/prisma";
import { MenuList } from "@/components/menu-list";

async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Convert Decimal to number for client components
  return products.map((product) => ({
    id: product.id,
    name: product.nameZh || product.name, // 優先使用中文名稱
    description: product.description,
    price: Number(product.price),
    image: product.image,
    category: product.category,
  }));
}

export default async function Home() {
  const products = await getProducts();

  return <MenuList products={products} />;
}
