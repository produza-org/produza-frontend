import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/core/api';
import { listProductsWithRecipe } from '@/features/production-orders/utils/products-with-recipe';

const listAllProductsMock = vi.fn();
const getProductRecipeMock = vi.fn();

vi.mock('@/features/products/api', () => ({
  listAllProducts: (...args: unknown[]) => listAllProductsMock(...args),
  getProductRecipe: (...args: unknown[]) => getProductRecipeMock(...args),
}));

describe('listProductsWithRecipe', () => {
  beforeEach(() => {
    listAllProductsMock.mockReset();
    getProductRecipeMock.mockReset();
  });

  it('keeps only active products that already have a recipe', async () => {
    listAllProductsMock.mockResolvedValueOnce([
      {
        id: 'p-1',
        name: 'With recipe',
        status: 'active',
      },
      {
        id: 'p-2',
        name: 'Without recipe',
        status: 'active',
      },
      {
        id: 'p-3',
        name: 'Inactive',
        status: 'inactive',
      },
    ]);
    getProductRecipeMock
      .mockResolvedValueOnce({ id: 'r-1' })
      .mockRejectedValueOnce(
        new ApiError({
          statusCode: 404,
          error: 'Not Found',
          message: 'Recipe not found',
        })
      );

    const products = await listProductsWithRecipe();

    expect(products.map((product) => product.id)).toEqual(['p-1']);
    expect(getProductRecipeMock).toHaveBeenCalledTimes(2);
  });
});
