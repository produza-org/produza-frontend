import { describe, it, expect } from 'vitest';
import {
  formatRawMaterialCode,
  isValidRawMaterialCode,
} from './raw-material-code';

describe('raw-material-code', () => {
  describe('formatRawMaterialCode', () => {
    it('formats input as AAAA-000', () => {
      expect(formatRawMaterialCode('stah1234')).toBe('STAH-123');
    });

    it('limits letters to 4 and digits to 3', () => {
      expect(formatRawMaterialCode('ABCDEF12345')).toBe('ABCD-123');
    });

    it('returns only letters when no digits are present', () => {
      expect(formatRawMaterialCode('ABCD')).toBe('ABCD');
    });
  });

  describe('isValidRawMaterialCode', () => {
    it('accepts valid codes with 2 to 4 letters', () => {
      expect(isValidRawMaterialCode('MP-001')).toBe(true);
      expect(isValidRawMaterialCode('STA-001')).toBe(true);
      expect(isValidRawMaterialCode('STAH-001')).toBe(true);
    });

    it('rejects invalid codes', () => {
      expect(isValidRawMaterialCode('A-001')).toBe(false);
      expect(isValidRawMaterialCode('STAH-01')).toBe(false);
      expect(isValidRawMaterialCode('STAH001')).toBe(false);
    });
  });
});
