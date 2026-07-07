export function formatRawMaterialCode(raw: string): string {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const letters = cleaned.replace(/[^A-Z]/g, '').slice(0, 4);
  const digits = cleaned.replace(/[^0-9]/g, '').slice(0, 3);
  if (digits.length === 0) return letters;
  return `${letters}-${digits}`;
}

export function isValidRawMaterialCode(code: string): boolean {
  return /^[A-Z]{4}-\d{3}$/.test(code);
}
