import { getProducts } from "@/lib/getProducts";
import CategoryClient from "../../../../components/CategoryClient";
import { Product } from "@/types/product";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
})  {
  const category = (await params).category;
  const products: Product[] = await getProducts(category);

  return <CategoryClient category={category} products={products} />;
}
