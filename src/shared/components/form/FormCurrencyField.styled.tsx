import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const CurrencyFieldRoot = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
}));

export const CurrencyPrefix = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(2),
  top: theme.spacing(2),
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.produza.onSurfaceVariant,
  fontVariantNumeric: 'tabular-nums',
  pointerEvents: 'none',
  zIndex: 1,
}));

export const CurrencyInputWrapper = styled(Box)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.produza.surfaceContainerHigh,
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    fontSize: 14,
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    borderBottom: `2px solid transparent`,
    transition: 'border-color 0.2s',
    fontVariantNumeric: 'tabular-nums',
    '&::before, &::after': { display: 'none' },
    '&.Mui-focused': {
      borderBottomColor: theme.palette.produza.primary,
    },
  },
  '& .MuiInputBase-input': {
    padding: 0,
    color: theme.palette.produza.onSurface,
    '&::placeholder': {
      color: theme.palette.produza.slate400,
      opacity: 1,
    },
  },
}));
