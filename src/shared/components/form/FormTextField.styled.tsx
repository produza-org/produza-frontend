import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const FieldBlock = styled(Box)(() => ({
  width: '100%',
}));

export const StyledTextFieldWrapper = styled(Box)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.produza.surfaceContainerHigh,
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    fontSize: 14,
    padding: theme.spacing(2),
    borderBottom: `2px solid transparent`,
    transition: 'border-color 0.2s',
    '&::before, &::after': { display: 'none' },
    '&.Mui-focused': {
      borderBottomColor: theme.palette.produza.primary,
    },
  },
  '& .MuiInputBase-input': {
    padding: 0,
    color: theme.palette.produza.onSurface,
    WebkitTextFillColor: theme.palette.produza.onSurface,
    '&::placeholder': {
      color: theme.palette.produza.slate600,
      opacity: 1,
      WebkitTextFillColor: theme.palette.produza.slate600,
    },
    '&.Mui-disabled': {
      color: theme.palette.produza.onSurfaceVariant,
      WebkitTextFillColor: theme.palette.produza.onSurfaceVariant,
      opacity: 1,
    },
  },
  '& .MuiInputBase-root.Mui-disabled': {
    opacity: 1,
  },
}));
