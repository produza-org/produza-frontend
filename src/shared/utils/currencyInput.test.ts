import { describe, it, expect } from 'vitest';
import {
  formatCurrencyBrlInput,
  handleCurrencyInputChange,
  parseCurrencyBrlInput,
  sanitizeIntegerInput,
} from './currencyInput';

describe('currencyInput', () => {
  describe('parseCurrencyBrlInput', () => {
    it('parses formatted currency strings', () => {
      expect(parseCurrencyBrlInput('1.234,56')).toBe(1234.56);
    });

    it('returns 0 for empty input', () => {
      expect(parseCurrencyBrlInput('')).toBe(0);
    });
  });

  describe('formatCurrencyBrlInput', () => {
    it('formats numbers as BRL display', () => {
      expect(formatCurrencyBrlInput(1234.56)).toBe('1.234,56');
    });
  });

  describe('handleCurrencyInputChange', () => {
    it('formats raw digits as currency', () => {
      expect(handleCurrencyInputChange('123456')).toBe('1.234,56');
    });
  });

  describe('sanitizeIntegerInput', () => {
    it('removes non-digit characters', () => {
      expect(sanitizeIntegerInput('12a3.4b5')).toBe('12345');
    });
  });
});
