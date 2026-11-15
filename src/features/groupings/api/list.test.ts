import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listAllRawMaterialGroups, listRawMaterialGroups } from './list';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('raw material groups list api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('requests paginated groups with page, limit and filters', async () => {
    apiClientMock.mockResolvedValueOnce({
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
    });

    await listRawMaterialGroups({
      page: 1,
      limit: 20,
      name: 'BASE',
      code: 'GRP',
      rawMaterial: 'MP-006',
    });

    expect(apiClientMock).toHaveBeenCalledWith(
      '/raw-material-groups?page=1&limit=20&name=BASE&code=GRP&rawMaterial=MP-006'
    );
  });

  it('loads every page when listing all groups', async () => {
    apiClientMock
      .mockResolvedValueOnce({
        data: [{ id: '1' }],
        meta: { page: 1, limit: 1, total: 2, totalPages: 2 },
      })
      .mockResolvedValueOnce({
        data: [{ id: '2' }],
        meta: { page: 2, limit: 1, total: 2, totalPages: 2 },
      });

    const items = await listAllRawMaterialGroups(1);

    expect(items.map((item) => item.id)).toEqual(['1', '2']);
    expect(apiClientMock).toHaveBeenNthCalledWith(
      1,
      '/raw-material-groups?page=1&limit=1'
    );
    expect(apiClientMock).toHaveBeenNthCalledWith(
      2,
      '/raw-material-groups?page=2&limit=1'
    );
  });
});
