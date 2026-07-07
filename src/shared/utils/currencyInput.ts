export function parseCurrencyBrlInput(value: string): number {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

export function formatCurrencyBrlInput(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function handleCurrencyInputChange(raw: string): string {
  const numeric = parseCurrencyBrlInput(raw);
  return formatCurrencyBrlInput(numeric);
}

export function sanitizeIntegerInput(value: string): string {
  return value.replace(/\D/g, '');
}
