import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listAllProducts, listProducts } from './list';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('products list api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('requests paginated products with page and limit', async () => {
    apiClientMock.mockResolvedValueOnce({
      data: [],
      meta: { page: 2, limit: 10, total: 0, totalPages: 1 },
    });

    await listProducts({ page: 2, limit: 10 });

    expect(apiClientMock).toHaveBeenCalledWith('/products?page=2&limit=10');
  });

  it('loads every page when listing all products', async () => {
    apiClientMock
      .mockResolvedValueOnce({
        data: [{ id: '1' }],
        meta: { page: 1, limit: 1, total: 2, totalPages: 2 },
      })
      .mockResolvedValueOnce({
        data: [{ id: '2' }],
        meta: { page: 2, limit: 1, total: 2, totalPages: 2 },
      });

    const items = await listAllProducts(1);

    expect(items.map((item) => item.id)).toEqual(['1', '2']);
    expect(apiClientMock).toHaveBeenNthCalledWith(1, '/products?page=1&limit=1');
    expect(apiClientMock).toHaveBeenNthCalledWith(2, '/products?page=2&limit=1');
  });
});
