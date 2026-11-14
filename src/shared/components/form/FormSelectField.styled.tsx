import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledSelectWrapper = styled(Box)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.produza.surfaceContainerHigh,
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    fontSize: 14,
    padding: 0,
    borderBottom: `2px solid transparent`,
    transition: 'border-color 0.2s',
    width: '100%',
    cursor: 'pointer',
    color: theme.palette.produza.onSurface,
    '&::before, &::after': { display: 'none' },
    '&.Mui-focused': {
      borderBottomColor: theme.palette.produza.primary,
    },
  },
  '& .MuiSelect-select': {
    padding: `${theme.spacing(2)} ${theme.spacing(4)} ${theme.spacing(2)} ${theme.spacing(2)} !important`,
    color: theme.palette.produza.onSurface,
    WebkitTextFillColor: theme.palette.produza.onSurface,
    width: '100%',
    boxSizing: 'border-box',
    opacity: 1,
  },
  '& .MuiSelect-select.MuiSelect-select': {
    color: theme.palette.produza.onSurface,
    WebkitTextFillColor: theme.palette.produza.onSurface,
  },
  '& .MuiSelect-icon': {
    right: theme.spacing(2),
    color: theme.palette.produza.onSurfaceVariant,
  },
}));
