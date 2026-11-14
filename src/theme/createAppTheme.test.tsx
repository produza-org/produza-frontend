import { describe, expect, it } from 'vitest';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { createAppTheme } from '@/theme';

describe('createAppTheme', () => {
  it('keeps disabled contained primary label readable in light mode', () => {
    const theme = createAppTheme('light');
    const containedPrimary = theme.components?.MuiButton?.styleOverrides
      ?.containedPrimary as Record<string, unknown> | undefined;
    const root = theme.components?.MuiButton?.styleOverrides?.root as
      | Record<string, unknown>
      | undefined;

    expect(containedPrimary).toBeDefined();
    const disabled = containedPrimary?.['&.Mui-disabled'] as
      | {
          color?: string;
          background?: string;
          opacity?: number;
          WebkitTextFillColor?: string;
          backgroundImage?: string;
        }
      | undefined;
    const rootDisabled = root?.[
      '&.MuiButton-containedPrimary.Mui-disabled'
    ] as
      | {
          color?: string;
          WebkitTextFillColor?: string;
          backgroundImage?: string;
        }
      | undefined;

    expect(disabled?.color).toBe(theme.palette.produza.onPrimary);
    expect(disabled?.WebkitTextFillColor).toBe(theme.palette.produza.onPrimary);
    expect(disabled?.background).toBe(theme.palette.produza.disabledPrimary);
    expect(disabled?.backgroundImage).toBe('none');
    expect(disabled?.opacity).toBe(1);
    expect(rootDisabled?.color).toBe(theme.palette.produza.onPrimary);
    expect(rootDisabled?.WebkitTextFillColor).toBe(
      theme.palette.produza.onPrimary
    );
    expect(rootDisabled?.backgroundImage).toBe('none');

    render(
      <ThemeProvider theme={theme}>
        <Button variant="contained" color="primary" disabled>
          Next
        </Button>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Next' });
    const styles = window.getComputedStyle(button);
    expect(styles.color).toBe('rgb(255, 255, 255)');
    expect(styles.webkitTextFillColor).toBe('rgb(255, 255, 255)');
    expect(styles.backgroundColor).toBe('rgb(38, 71, 120)');
    expect(styles.backgroundImage).toBe('none');
    expect(styles.opacity).toBe('1');
  });

  it('keeps disabled contained primary label readable in dark mode', () => {
    const theme = createAppTheme('dark');
    const containedPrimary = theme.components?.MuiButton?.styleOverrides
      ?.containedPrimary as Record<string, unknown> | undefined;

    const disabled = containedPrimary?.['&.Mui-disabled'] as
      | { color?: string; background?: string; WebkitTextFillColor?: string }
      | undefined;

    expect(disabled?.color).toBe(theme.palette.produza.onPrimary);
    expect(disabled?.WebkitTextFillColor).toBe(theme.palette.produza.onPrimary);
    expect(disabled?.background).toBe(theme.palette.produza.disabledPrimary);
  });
});
