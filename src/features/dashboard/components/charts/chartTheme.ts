import type { Theme } from '@mui/material/styles';

export function getChartColors(theme: Theme) {
  const p = theme.palette.produza;
  return {
    planned: p.slate400,
    actual: p.confirm,
    primary: p.primaryMid,
    secondary: p.secondary,
    success: p.success,
    warning: p.warning,
    error: p.error,
    muted: p.slate500,
    grid: p.outlineVariant,
    tooltipBg: p.surfaceContainerLowest,
    tooltipBorder: p.outlineVariant,
  };
}
