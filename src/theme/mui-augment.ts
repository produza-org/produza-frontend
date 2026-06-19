import type { ProduzaPalette } from '@/theme/produzaTokens';

declare module '@mui/material/styles' {
  interface Palette {
    produza: ProduzaPalette;
  }
  interface PaletteOptions {
    produza?: ProduzaPalette;
  }
}

export {};
