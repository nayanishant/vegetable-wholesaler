import { useMemo } from "react";
import { Product } from "@/types/product";

export function useFilteredProducts(products: Product[], searchTerm: string) {
  return useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );
}