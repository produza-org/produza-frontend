import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listAllRawMaterials, listRawMaterials } from './list';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('raw materials list api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('requests paginated raw materials with page and limit', async () => {
    apiClientMock.mockResolvedValueOnce({
      data: [],
      meta: { page: 2, limit: 10, total: 0, totalPages: 1 },
    });

    await listRawMaterials({ page: 2, limit: 10 });

    expect(apiClientMock).toHaveBeenCalledWith('/raw-materials?page=2&limit=10');
  });

  it('loads every page when listing all raw materials', async () => {
    apiClientMock
      .mockResolvedValueOnce({
        data: [{ id: '1' }],
        meta: { page: 1, limit: 1, total: 2, totalPages: 2 },
      })
      .mockResolvedValueOnce({
        data: [{ id: '2' }],
        meta: { page: 2, limit: 1, total: 2, totalPages: 2 },
      });

    const items = await listAllRawMaterials(1);

    expect(items.map((item) => item.id)).toEqual(['1', '2']);
    expect(apiClientMock).toHaveBeenNthCalledWith(1, '/raw-materials?page=1&limit=1');
    expect(apiClientMock).toHaveBeenNthCalledWith(2, '/raw-materials?page=2&limit=1');
  });
});
