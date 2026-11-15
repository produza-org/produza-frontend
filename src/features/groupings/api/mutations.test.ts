import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRawMaterialGroupRequest } from './create';
import { deleteRawMaterialGroupRequest } from './delete';
import { getRawMaterialGroup } from './get';
import { updateRawMaterialGroupRequest } from './update';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('raw material groups mutation api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('creates a group with POST', async () => {
    const input = {
      name: 'BASE LEITE COCO',
      code: 'GRP-001',
      description: 'Optional',
      lines: [{ rawMaterialId: 'mp-1', quantity: 1.5 }],
    };
    apiClientMock.mockResolvedValueOnce({
      id: 'g-1',
      ...input,
      status: 'active',
      materialsCount: 1,
      totalCost: 1.5,
    });

    await createRawMaterialGroupRequest(input);

    expect(apiClientMock).toHaveBeenCalledWith('/raw-material-groups', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  });

  it('fetches a group by id', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'g-1' });

    await getRawMaterialGroup('g-1');

    expect(apiClientMock).toHaveBeenCalledWith('/raw-material-groups/g-1');
  });

  it('updates a group with PATCH replace-all lines', async () => {
    const input = {
      name: 'BASE LEITE COCO',
      lines: [{ rawMaterialId: 'mp-2', quantity: 2 }],
    };
    apiClientMock.mockResolvedValueOnce({ id: 'g-1', ...input });

    await updateRawMaterialGroupRequest('g-1', input);

    expect(apiClientMock).toHaveBeenCalledWith('/raw-material-groups/g-1', {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  });

  it('soft-deletes a group with DELETE', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'g-1', status: 'inactive' });

    await deleteRawMaterialGroupRequest('g-1');

    expect(apiClientMock).toHaveBeenCalledWith('/raw-material-groups/g-1', {
      method: 'DELETE',
    });
  });
});
