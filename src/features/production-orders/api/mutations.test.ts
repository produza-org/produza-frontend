import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProductionOrderRequest } from './create';
import { getProductionOrder } from './get';
import { recalculateProductionOrderFromRecipe } from './recalculate';
import { updateProductionOrderRequest } from './update';

const apiClientMock = vi.fn();

vi.mock('@/core/api', () => ({
  apiClient: (...args: unknown[]) => apiClientMock(...args),
}));

describe('production orders mutation api', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('creates a production order with POST', async () => {
    const input = {
      number: '108',
      productId: 'p-1',
      qtdAProduzir: 27,
      startDate: '2026-11-12',
      plannedEndDate: '2026-11-13',
      notes: 'Demo OP 108',
    };
    apiClientMock.mockResolvedValueOnce({
      id: 'op-1',
      ...input,
      yieldSnapshot: 0.75,
      totalMisturaKg: 20.25,
      emitidaEm: '2026-11-12T03:00:00.000Z',
      needLines: [],
      product: { id: 'p-1', name: 'POTE 1,5L COCO BRANCO', yield: 0.75 },
    });

    await createProductionOrderRequest(input);

    expect(apiClientMock).toHaveBeenCalledWith('/production-orders', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  });

  it('fetches a production order by id', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'op-1' });

    await getProductionOrder('op-1');

    expect(apiClientMock).toHaveBeenCalledWith('/production-orders/op-1');
  });

  it('updates a production order with PATCH', async () => {
    apiClientMock.mockResolvedValueOnce({
      id: 'op-1',
      qtdAProduzir: 54,
      totalMisturaKg: 40.5,
    });

    await updateProductionOrderRequest('op-1', { qtdAProduzir: 54 });

    expect(apiClientMock).toHaveBeenCalledWith('/production-orders/op-1', {
      method: 'PATCH',
      body: JSON.stringify({ qtdAProduzir: 54 }),
    });
  });

  it('recalculates from recipe with POST', async () => {
    apiClientMock.mockResolvedValueOnce({ id: 'op-1' });

    await recalculateProductionOrderFromRecipe('op-1');

    expect(apiClientMock).toHaveBeenCalledWith(
      '/production-orders/op-1/recalculate-from-recipe',
      {
        method: 'POST',
      }
    );
  });
});
