import { getProducts } from "@/lib/getProducts";
import ProductsClient from "./ProductsClient";

export const revalidate = 30;

export default async function Products() {
  const products = await getProducts();

  return <ProductsClient products={products} />;
}
