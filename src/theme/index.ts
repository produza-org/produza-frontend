import '@/theme/mui-augment';
import { createTheme, type PaletteMode } from '@mui/material/styles';
import { darkProduzaPalette, lightProduzaPalette } from '@/theme/produzaTokens';

const interStack =
  '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';

const stitchLight = {
  primary: '#001736',
  primaryContainer: '#002b5b',
  onPrimary: '#ffffff',
  surface: '#f6fafe',
  surfaceContainerLow: '#f0f4f8',
  surfaceLowest: '#ffffff',
  onSurface: '#171c1f',
  onSurfaceVariant: '#43474f',
  secondary: '#515f74',
  outline: '#747780',
  outlineVariant: '#c4c6d0',
  success: '#166534',
  onSuccess: '#ffffff',
};

const stitchDark = {
  background: '#0c1014',
  paper: '#161c22',
  primary: '#a9c7ff',
  primaryDark: '#7594ca',
  onPrimary: '#001b3d',
  surface: '#1a2229',
  border: '#2c3134',
  text: '#e4e9ed',
  textMuted: '#9aa5b1',
  secondary: '#b9c7df',
};

export function createAppTheme(mode: PaletteMode) {
  const isLight = mode === 'light';
  const produza = isLight ? lightProduzaPalette : darkProduzaPalette;

  return createTheme({
    palette: {
      mode,
      produza,
      ...(isLight
        ? {
            primary: {
              main: stitchLight.primary,
              dark: stitchLight.primaryContainer,
              light: produza.primaryMid,
              contrastText: stitchLight.onPrimary,
            },
            secondary: {
              main: stitchLight.secondary,
              contrastText: stitchLight.onPrimary,
            },
            background: {
              default: stitchLight.surface,
              paper: stitchLight.surfaceLowest,
            },
            text: {
              primary: stitchLight.onSurface,
              secondary: stitchLight.onSurfaceVariant,
            },
            divider: stitchLight.outlineVariant,
            success: {
              main: stitchLight.success,
              contrastText: stitchLight.onSuccess,
            },
          }
        : {
            primary: {
              main: stitchDark.primary,
              dark: stitchDark.primaryDark,
              light: '#d6e3ff',
              contrastText: stitchDark.onPrimary,
            },
            secondary: {
              main: stitchDark.secondary,
              contrastText: stitchDark.background,
            },
            background: {
              default: stitchDark.background,
              paper: stitchDark.paper,
            },
            text: {
              primary: stitchDark.text,
              secondary: stitchDark.textMuted,
            },
            divider: stitchDark.border,
            success: {
              main: '#8bd79b',
              contrastText: '#00210b',
            },
          }),
    },
    typography: {
      fontFamily: interStack,
      h6: { fontWeight: 600, letterSpacing: '-0.02em' },
      button: { letterSpacing: '0.02em', fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isLight
              ? `${stitchLight.outlineVariant} ${stitchLight.surfaceContainerLow}`
              : `${stitchDark.border} ${stitchDark.background}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight
              ? stitchLight.surfaceContainerLow
              : stitchDark.surface,
            borderRight: `1px solid ${isLight ? stitchLight.outlineVariant : stitchDark.border}`,
            boxSizing: 'border-box',
          },
        },
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
          color: 'default',
        },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: isLight
              ? stitchLight.surfaceLowest
              : stitchDark.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: isLight
            ? {
                background: `linear-gradient(145deg, ${stitchLight.primary} 0%, ${stitchLight.primaryContainer} 100%)`,
                '&:hover': {
                  background: `linear-gradient(145deg, ${stitchLight.primaryContainer} 0%, ${produza.primaryMid} 100%)`,
                },
              }
            : {},
        },
      },
    },
  });
}
