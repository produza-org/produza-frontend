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
    apiClientMock.mockResolvedValueOnce({
      id: 'r-1',
      productId: 'p-1',
      componentSum: 1,
      lines: [
        {
          id: 'line-1',
          rawMaterialId: 'm-1',
          unitConsumption: 0.25,
          unit: 'KG',
          sortOrder: 0,
        },
      ],
    });

    await expect(getProductRecipe('p-1')).resolves.toEqual({
      id: 'r-1',
      productId: 'p-1',
      proportionSum: 1,
      createdAt: undefined,
      updatedAt: undefined,
      lines: [
        {
          id: 'line-1',
          rawMaterialId: 'm-1',
          proportion: 0.25,
          unit: 'KG',
          sortOrder: 0,
          rawMaterial: undefined,
        },
      ],
    });

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
      componentSum: 1,
      lines: [
        {
          id: 'line-1',
          rawMaterialId: 'm-1',
          unitConsumption: 1,
          unit: 'KG',
          sortOrder: 0,
        },
      ],
    });

    await expect(upsertProductRecipe('p-1', input)).resolves.toMatchObject({
      proportionSum: 1,
      lines: [{ proportion: 1 }],
    });

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1/recipe', {
      method: 'PUT',
      body: JSON.stringify({
        lines: [
          {
            rawMaterialId: 'm-1',
            unitConsumption: 1,
            sortOrder: 0,
          },
        ],
      }),
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
