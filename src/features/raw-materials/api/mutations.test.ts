import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRawMaterialRequest } from './create';
import { deleteRawMaterialRequest } from './delete';
import { getRawMaterial } from './get';
import { updateRawMaterialRequest } from './update';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('raw materials mutation api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('creates a raw material with POST', async () => {
    const input = {
      code: 'MP-031',
      name: 'COCO RALADO',
      unit: 'KG' as const,
      unitCost: 12.5,
      stockQuantity: 10,
      minStock: 5,
    };
    apiClientMock.mockResolvedValueOnce({ id: 'rm-1', ...input, status: 'active' });

    await createRawMaterialRequest(input);

    expect(apiClientMock).toHaveBeenCalledWith('/raw-materials', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  });

  it('fetches a raw material by id', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'rm-1' });

    await getRawMaterial('rm-1');

    expect(apiClientMock).toHaveBeenCalledWith('/raw-materials/rm-1');
  });

  it('updates a raw material with PATCH', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'rm-1', status: 'inactive' });

    await updateRawMaterialRequest('rm-1', { status: 'inactive' });

    expect(apiClientMock).toHaveBeenCalledWith('/raw-materials/rm-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'inactive' }),
    });
  });

  it('soft-deletes a raw material with DELETE', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'rm-1', status: 'inactive' });

    await deleteRawMaterialRequest('rm-1');

    expect(apiClientMock).toHaveBeenCalledWith('/raw-materials/rm-1', {
      method: 'DELETE',
    });
  });
});
