import { describe, expect, it } from 'vitest';
import {
  computeExpansionFactor,
  parseDecimalInput,
  sanitizeDecimalInput,
} from './format';

describe('products format helpers', () => {
  it('sanitizes decimal input and keeps a single separator', () => {
    expect(sanitizeDecimalInput('1,5a')).toBe('1.5');
    expect(sanitizeDecimalInput('1.2.3')).toBe('1.23');
  });

  it('parses decimal input with comma or dot', () => {
    expect(parseDecimalInput('0,75')).toBe(0.75);
    expect(parseDecimalInput('1.5')).toBe(1.5);
  });

  it('computes expansion factor as 1 / yield', () => {
    expect(computeExpansionFactor(0.75)).toBeCloseTo(1.3333333333);
    expect(computeExpansionFactor(0)).toBeNull();
    expect(computeExpansionFactor(-1)).toBeNull();
  });
});
