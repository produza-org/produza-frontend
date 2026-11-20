import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledAutocompleteWrapper = styled(Box)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.produza.surfaceContainerHigh,
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    fontSize: 14,
    padding: `${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(2)}`,
    borderBottom: `2px solid transparent`,
    transition: 'border-color 0.2s',
    '&::before, &::after': { display: 'none' },
    '&.Mui-focused': {
      borderBottomColor: theme.palette.produza.primary,
    },
    '&.Mui-error': {
      borderBottomColor: theme.palette.error.main,
    },
    '&.Mui-error.Mui-focused': {
      borderBottomColor: theme.palette.error.main,
    },
  },
  '& .MuiFormHelperText-root.Mui-error': {
    marginLeft: 0,
    marginRight: 0,
    marginTop: theme.spacing(0.75),
    color: theme.palette.error.main,
  },
  '& .MuiInputBase-input': {
    padding: `${theme.spacing(1)} 0 !important`,
    color: theme.palette.produza.onSurface,
    '&::placeholder': {
      color: theme.palette.produza.slate400,
      opacity: 1,
    },
  },
  '& .MuiAutocomplete-endAdornment': {
    right: theme.spacing(1.5),
  },
}));
