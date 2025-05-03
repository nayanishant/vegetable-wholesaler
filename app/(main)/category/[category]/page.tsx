import { getProducts } from "@/lib/getProducts";
import CategoryClient from "./CategoryClient";
import { Product } from "@/types/product";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const categoryParam = category.toLowerCase();

  const allProducts: Product[] = await getProducts();

  const filteredProducts: Product[] = allProducts.filter(
    (product) => product.category?.toLowerCase() === categoryParam
  );

  return (
    <CategoryClient category={categoryParam} products={filteredProducts} />
  );
}
