import { describe, expect, it } from 'vitest';
import { createAppTheme } from '@/theme';

describe('createAppTheme', () => {
  it('keeps disabled contained primary label readable in light mode', () => {
    const theme = createAppTheme('light');
    const containedPrimary = theme.components?.MuiButton?.styleOverrides
      ?.containedPrimary as Record<string, unknown> | undefined;

    expect(containedPrimary).toBeDefined();
    const disabled = containedPrimary?.['&.Mui-disabled'] as
      | { color?: string; background?: string; opacity?: number }
      | undefined;

    expect(disabled?.color).toBe(theme.palette.produza.onPrimary);
    expect(disabled?.background).toBe(theme.palette.produza.disabledPrimary);
    expect(disabled?.opacity).toBe(1);
  });

  it('keeps disabled contained primary label readable in dark mode', () => {
    const theme = createAppTheme('dark');
    const containedPrimary = theme.components?.MuiButton?.styleOverrides
      ?.containedPrimary as Record<string, unknown> | undefined;

    const disabled = containedPrimary?.['&.Mui-disabled'] as
      | { color?: string; background?: string }
      | undefined;

    expect(disabled?.color).toBe(theme.palette.produza.onPrimary);
    expect(disabled?.background).toBe(theme.palette.produza.disabledPrimary);
  });
});
