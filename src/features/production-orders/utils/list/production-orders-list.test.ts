import { describe, expect, it } from 'vitest';
import type { ProductionOrder } from '@/features/production-orders/types/production-order';
import {
  filterProductionOrders,
  getPageNumbers,
} from '@/features/production-orders/utils/list/production-orders-list';

function order(
  partial: Pick<ProductionOrder, 'id' | 'number'> & {
    productName?: string;
  }
): ProductionOrder {
  return {
    id: partial.id,
    number: partial.number,
    productId: 'p-1',
    product: {
      id: 'p-1',
      name: partial.productName ?? 'POTE 1,5L COCO BRANCO',
      yield: 0.75,
    },
    qtdAProduzir: 27,
    yieldSnapshot: 0.75,
    totalMisturaKg: 20.25,
    emitidaEm: '2026-11-12T03:00:00.000Z',
    startDate: null,
    plannedEndDate: null,
    notes: null,
    needLines: [],
  };
}

describe('filterProductionOrders', () => {
  const items = [
    order({ id: '1', number: '108', productName: 'POTE 1,5L COCO BRANCO' }),
    order({ id: '2', number: '109', productName: 'POTE CHOCOLATE' }),
  ];

  it('filters by order number', () => {
    expect(filterProductionOrders(items, '108').map((item) => item.id)).toEqual([
      '1',
    ]);
  });

  it('filters by product name', () => {
    expect(
      filterProductionOrders(items, 'chocolate').map((item) => item.id)
    ).toEqual(['2']);
  });

  it('returns all items when filter is empty', () => {
    expect(filterProductionOrders(items, '   ')).toHaveLength(2);
  });
});

describe('getPageNumbers', () => {
  it('lists every page when total is small', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
  });

  it('inserts ellipsis for larger ranges', () => {
    expect(getPageNumbers(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });
});
