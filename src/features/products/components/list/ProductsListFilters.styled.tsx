import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const FiltersRoot = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  borderRadius: 12,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
}));

export const FiltersRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: theme.spacing(3),
}));

export const FieldBlock = styled(Box)(() => ({
  flex: 1,
  minWidth: 240,
}));

export const FieldLabel = styled('label')(({ theme }) => ({
  display: 'block',
  fontSize: 10,
  fontWeight: 900,
  color: theme.palette.produza.slate500,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: theme.spacing(1),
}));

export const FilterTextField = styled('div')(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.produza.surfaceContainerLowest,
    borderRadius: 8,
    fontSize: 14,
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    '& fieldset': {
      borderColor: `${theme.palette.produza.outlineVariant}80`,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.produza.outlineVariant,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.produza.primary,
      borderWidth: 1,
    },
  },
}));

export const FilterSubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.produza.primary,
  color: theme.palette.produza.onPrimary,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  minHeight: 38,
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.produza.primaryContainer,
    boxShadow: 'none',
  },
}));
