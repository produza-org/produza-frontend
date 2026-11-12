import { ApiError } from '@/core/api';
import { getProductRecipe, listAllProducts } from '@/features/products/api';
import type { Product } from '@/features/products/types/product';

export async function listProductsWithRecipe(): Promise<Product[]> {
  const products = await listAllProducts();
  const activeProducts = products.filter((product) => product.status === 'active');

  const results = await Promise.all(
    activeProducts.map(async (product) => {
      try {
        await getProductRecipe(product.id);
        return product;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    })
  );

  return results.filter((product): product is Product => product !== null);
}
