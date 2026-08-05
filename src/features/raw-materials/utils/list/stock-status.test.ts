import { describe, it, expect } from 'vitest';
import { getStockStatus } from './stock-status';

describe('getStockStatus', () => {
  it('returns critical when stock is below minimum', () => {
    expect(getStockStatus(49, 50)).toBe('critical');
    expect(getStockStatus(0, 50)).toBe('critical');
  });

  it('returns warning when stock is at or above minimum but below 1.5x', () => {
    expect(getStockStatus(50, 50)).toBe('warning');
    expect(getStockStatus(74, 50)).toBe('warning');
  });

  it('returns ok when stock is at or above 1.5x minimum', () => {
    expect(getStockStatus(75, 50)).toBe('ok');
    expect(getStockStatus(500, 50)).toBe('ok');
  });
});
