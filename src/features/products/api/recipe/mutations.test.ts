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
          category: 'MATERIA_PRIMA',
          unitConsumption: 0.25,
          unit: 'KG',
          sortOrder: 0,
        },
        {
          id: 'line-2',
          rawMaterialId: 'm-2',
          category: 'COMPONENTE',
          unitConsumption: 0.5,
          unit: 'KG',
          sortOrder: 1,
        },
      ],
    });

    await expect(getProductRecipe('p-1')).resolves.toEqual({
      id: 'r-1',
      productId: 'p-1',
      proportionSum: 0.25,
      createdAt: undefined,
      updatedAt: undefined,
      lines: [
        {
          id: 'line-1',
          rawMaterialId: 'm-1',
          category: 'MATERIA_PRIMA',
          proportion: 0.25,
          unit: 'KG',
          sortOrder: 0,
          rawMaterial: undefined,
        },
        {
          id: 'line-2',
          rawMaterialId: 'm-2',
          category: 'COMPONENTE',
          proportion: 0.5,
          unit: 'KG',
          sortOrder: 1,
          rawMaterial: undefined,
        },
      ],
      groups: [],
    });

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1/recipe');
  });

  it('defaults missing category to MATERIA_PRIMA', async () => {
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

    await expect(getProductRecipe('p-1')).resolves.toMatchObject({
      proportionSum: 1,
      lines: [{ category: 'MATERIA_PRIMA', proportion: 1 }],
    });
  });

  it('upserts a product recipe with PUT including category', async () => {
    const input = {
      lines: [
        {
          rawMaterialId: 'm-1',
          category: 'MATERIA_PRIMA' as const,
          proportion: 1,
          sortOrder: 0,
        },
        {
          rawMaterialId: 'm-2',
          category: 'EMBALAGEM' as const,
          proportion: 1,
          sortOrder: 1,
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
          category: 'MATERIA_PRIMA',
          unitConsumption: 1,
          unit: 'KG',
          sortOrder: 0,
        },
        {
          id: 'line-2',
          rawMaterialId: 'm-2',
          category: 'EMBALAGEM',
          unitConsumption: 1,
          unit: 'UNID',
          sortOrder: 1,
        },
      ],
    });

    await expect(upsertProductRecipe('p-1', input)).resolves.toMatchObject({
      proportionSum: 1,
      lines: [
        { category: 'MATERIA_PRIMA', proportion: 1 },
        { category: 'EMBALAGEM', proportion: 1 },
      ],
    });

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1/recipe', {
      method: 'PUT',
      body: JSON.stringify({
        lines: [
          {
            rawMaterialId: 'm-1',
            category: 'MATERIA_PRIMA',
            unitConsumption: 1,
            sortOrder: 0,
          },
          {
            rawMaterialId: 'm-2',
            category: 'EMBALAGEM',
            unitConsumption: 1,
            sortOrder: 1,
          },
        ],
        groups: [],
      }),
    });
  });

  it('maps nested groups and includes group MP lines in proportionSum', async () => {
    apiClientMock.mockResolvedValueOnce({
      id: 'r-1',
      productId: 'p-1',
      componentSum: 1,
      lines: [
        {
          id: 'line-1',
          rawMaterialId: 'm-1',
          category: 'MATERIA_PRIMA',
          unitConsumption: 0.01,
          unit: 'LITRO',
          sortOrder: 0,
        },
      ],
      groups: [
        {
          id: 'g-1',
          category: 'COMPONENTE',
          name: 'BASE LEITE COCO',
          sourceGroupingId: 'catalog-grp-1',
          sortOrder: 0,
          lines: [
            {
              id: 'gl-1',
              rawMaterialId: 'm-2',
              unitConsumption: 0.6,
              unit: 'LITRO',
              sortOrder: 0,
            },
            {
              id: 'gl-2',
              rawMaterialId: 'm-3',
              unitConsumption: 0.4,
              unit: 'LITRO',
              sortOrder: 1,
            },
          ],
        },
      ],
    });

    await expect(getProductRecipe('p-1')).resolves.toMatchObject({
      proportionSum: 0.01,
      groups: [
        {
          id: 'g-1',
          category: 'COMPONENTE',
          name: 'BASE LEITE COCO',
          sourceGroupingId: 'catalog-grp-1',
          lines: [
            { rawMaterialId: 'm-2', category: 'COMPONENTE', proportion: 0.6 },
            { rawMaterialId: 'm-3', category: 'COMPONENTE', proportion: 0.4 },
          ],
        },
      ],
    });
  });

  it('upserts nested groups with unitConsumption mapping', async () => {
    const input = {
      lines: [
        {
          rawMaterialId: 'm-1',
          category: 'MATERIA_PRIMA' as const,
          proportion: 1,
          sortOrder: 0,
        },
      ],
      groups: [
        {
          category: 'COMPONENTE' as const,
          name: 'BASE LEITE COCO',
          sourceGroupingId: 'catalog-grp-1',
          sortOrder: 0,
          lines: [
            { rawMaterialId: 'm-2', proportion: 0.6, sortOrder: 0 },
            { rawMaterialId: 'm-3', proportion: 0.4, sortOrder: 1 },
          ],
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
          category: 'MATERIA_PRIMA',
          unitConsumption: 1,
          unit: 'KG',
          sortOrder: 0,
        },
      ],
      groups: [
        {
          id: 'g-1',
          category: 'COMPONENTE',
          name: 'BASE LEITE COCO',
          sourceGroupingId: 'catalog-grp-1',
          sortOrder: 0,
          lines: [
            {
              id: 'gl-1',
              rawMaterialId: 'm-2',
              unitConsumption: 0.6,
              unit: 'KG',
              sortOrder: 0,
            },
            {
              id: 'gl-2',
              rawMaterialId: 'm-3',
              unitConsumption: 0.4,
              unit: 'KG',
              sortOrder: 1,
            },
          ],
        },
      ],
    });

    await expect(upsertProductRecipe('p-1', input)).resolves.toMatchObject({
      groups: [
        {
          name: 'BASE LEITE COCO',
          lines: [{ proportion: 0.6 }, { proportion: 0.4 }],
        },
      ],
    });

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1/recipe', {
      method: 'PUT',
      body: JSON.stringify({
        lines: [
          {
            rawMaterialId: 'm-1',
            category: 'MATERIA_PRIMA',
            unitConsumption: 1,
            sortOrder: 0,
          },
        ],
        groups: [
          {
            category: 'COMPONENTE',
            name: 'BASE LEITE COCO',
            sourceGroupingId: 'catalog-grp-1',
            sortOrder: 0,
            lines: [
              {
                rawMaterialId: 'm-2',
                unitConsumption: 0.6,
                sortOrder: 0,
              },
              {
                rawMaterialId: 'm-3',
                unitConsumption: 0.4,
                sortOrder: 1,
              },
            ],
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
