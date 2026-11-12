import { describe, expect, it } from 'vitest';
import { getRealVariation } from './variation';

describe('getRealVariation', () => {
  it('returns real minus Q and allows positive surplus', () => {
    expect(getRealVariation(30, 27)).toBe(3);
    expect(getRealVariation(0, 27)).toBe(-27);
    expect(getRealVariation(27, 27)).toBe(0);
  });
});
