import { getProducts } from "@/lib/getProducts";
import CategoryClient from "./CategoryClient";
import { Product } from "@/types/product";

interface CategoryPageProps {
  params: { category: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryParam = params.category.toLowerCase();

  const allProducts: Product[] = await getProducts();

  const filteredProducts = allProducts.filter((product) =>
    product.category?.toLowerCase() === categoryParam
  );

  return <CategoryClient category={categoryParam} products={filteredProducts} />;
}
