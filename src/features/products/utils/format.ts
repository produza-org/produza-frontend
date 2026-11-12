export function formatDecimal(value: number, maximumFractionDigits = 4) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatQuantity(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function sanitizeDecimalInput(value: string): string {
  const normalized = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
  const firstDot = normalized.indexOf('.');
  if (firstDot === -1) {
    return normalized;
  }
  return (
    normalized.slice(0, firstDot + 1) +
    normalized.slice(firstDot + 1).replace(/\./g, '')
  );
}

export function parseDecimalInput(value: string): number {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) {
    return NaN;
  }
  return Number(normalized);
}

export function computeExpansionFactor(yieldValue: number): number | null {
  if (!(yieldValue > 0) || !Number.isFinite(yieldValue)) {
    return null;
  }
  return 1 / yieldValue;
}
