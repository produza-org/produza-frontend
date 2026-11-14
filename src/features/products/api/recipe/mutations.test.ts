import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteProductRecipe } from './delete';
import { getProductRecipe } from './get';
import { upsertProductRecipe } from './upsert';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('product recipe api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('fetches a product recipe by product id', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'r-1', productId: 'p-1', lines: [] });

    await getProductRecipe('p-1');

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1/recipe');
  });

  it('upserts a product recipe with PUT', async () => {
    const input = {
      lines: [
        {
          rawMaterialId: 'm-1',
          proportion: 1,
          sortOrder: 0,
        },
      ],
    };
    apiClientMock.mockResolvedValueOnce({
      id: 'r-1',
      productId: 'p-1',
      proportionSum: 1,
      lines: [],
    });

    await upsertProductRecipe('p-1', input);

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1/recipe', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  });

  it('deletes a product recipe with DELETE', async () => {
    apiClientMock.mockResolvedValueOnce(undefined);

    await deleteProductRecipe('p-1');

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1/recipe', {
      method: 'DELETE',
    });
  });
});
