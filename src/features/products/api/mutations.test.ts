import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProductRequest } from './create';
import { deleteProductRequest } from './delete';
import { getProduct } from './get';
import { updateProductRequest } from './update';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('products mutation api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('creates a product with POST', async () => {
    const input = {
      name: 'POTE 1,5L COCO BRANCO',
      finalSize: 1.5,
      finalSizeUnit: 'L' as const,
      yield: 0.75,
    };
    apiClientMock.mockResolvedValueOnce({
      id: 'p-1',
      ...input,
      expansionFactor: 1.3333333333333333,
      status: 'active',
    });

    await createProductRequest(input);

    expect(apiClientMock).toHaveBeenCalledWith('/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  });

  it('fetches a product by id', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'p-1' });

    await getProduct('p-1');

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1');
  });

  it('updates a product with PATCH', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'p-1', status: 'inactive' });

    await updateProductRequest('p-1', { status: 'inactive' });

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'inactive' }),
    });
  });

  it('soft-deletes a product with DELETE', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'p-1', status: 'inactive' });

    await deleteProductRequest('p-1');

    expect(apiClientMock).toHaveBeenCalledWith('/products/p-1', {
      method: 'DELETE',
    });
  });
});
