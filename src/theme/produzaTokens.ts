export interface ProduzaPalette {
  onSurface: string;
  onSurfaceVariant: string;
  surface: string;
  surfaceContainerLow: string;
  surfaceContainerHigh: string;
  surfaceContainerLowest: string;
  outlineVariant: string;
  primary: string;
  primaryContainer: string;
  primaryMid: string;
  disabledPrimary: string;
  tertiaryFixedDim: string;
  secondary: string;
  error: string;
  errorContainer: string;
  onPrimary: string;
  confirm: string;
  confirmHover: string;
  warning: string;
  success: string;
  successContainer: string;
  slate100: string;
  slate500: string;
  slate400: string;
  slate600: string;
}

export const lightProduzaPalette: ProduzaPalette = {
  onSurface: '#171c1f',
  onSurfaceVariant: '#43474f',
  surface: '#f6fafe',
  surfaceContainerLow: '#f0f4f8',
  surfaceContainerHigh: '#e4e9ed',
  surfaceContainerLowest: '#ffffff',
  outlineVariant: '#c4c6d0',
  primary: '#001736',
  primaryContainer: '#002b5b',
  primaryMid: '#264778',
  disabledPrimary: '#264778',
  tertiaryFixedDim: '#8bd79b',
  secondary: '#515f74',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onPrimary: '#ffffff',
  confirm: '#1d4ed8',
  confirmHover: '#1e40af',
  warning: '#a16207',
  success: '#15803d',
  successContainer: '#dcfce7',
  slate100: '#f1f5f9',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate600: '#475569',
};

export const darkProduzaPalette: ProduzaPalette = {
  onSurface: '#e4e9ed',
  onSurfaceVariant: '#9aa5b1',
  surface: '#1a2229',
  surfaceContainerLow: '#161c22',
  surfaceContainerHigh: '#2c3134',
  surfaceContainerLowest: '#0c1014',
  outlineVariant: '#3d4650',
  primary: '#a9c7ff',
  primaryContainer: '#7594ca',
  primaryMid: '#264778',
  disabledPrimary: '#7594ca',
  tertiaryFixedDim: '#8bd79b',
  secondary: '#b9c7df',
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onPrimary: '#001b3d',
  confirm: '#3b82f6',
  confirmHover: '#60a5fa',
  warning: '#fbbf24',
  success: '#8bd79b',
  successContainer: '#8bd79b33',
  slate100: '#2c3134',
  slate500: '#9aa5b1',
  slate400: '#747d88',
  slate600: '#b0bac4',
};
