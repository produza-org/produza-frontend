import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listAllProductionOrders, listProductionOrders } from './list';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('production orders list api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('requests paginated production orders with page and limit', async () => {
    apiClientMock.mockResolvedValueOnce({
      data: [],
      meta: { page: 2, limit: 10, total: 0, totalPages: 1 },
    });

    await listProductionOrders({ page: 2, limit: 10 });

    expect(apiClientMock).toHaveBeenCalledWith(
      '/production-orders?page=2&limit=10'
    );
  });

  it('loads every page when listing all production orders', async () => {
    apiClientMock
      .mockResolvedValueOnce({
        data: [{ id: '1' }],
        meta: { page: 1, limit: 1, total: 2, totalPages: 2 },
      })
      .mockResolvedValueOnce({
        data: [{ id: '2' }],
        meta: { page: 2, limit: 1, total: 2, totalPages: 2 },
      });

    const items = await listAllProductionOrders(1);

    expect(items.map((item) => item.id)).toEqual(['1', '2']);
    expect(apiClientMock).toHaveBeenNthCalledWith(
      1,
      '/production-orders?page=1&limit=1'
    );
    expect(apiClientMock).toHaveBeenNthCalledWith(
      2,
      '/production-orders?page=2&limit=1'
    );
  });
});
