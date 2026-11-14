import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const FormCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  boxShadow: '0 12px 32px rgba(0, 27, 61, 0.04)',
}));

export const FormCardAccent = styled(Box)(({ theme }) => ({
  height: 6,
  width: '100%',
  background: `linear-gradient(to right, ${theme.palette.produza.primary}, ${theme.palette.produza.primaryContainer})`,
}));

export const FormBody = styled('form')(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

export const FormRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

export const ValidationAlert = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  borderRadius: 12,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
}));

export const ValidationAlertTitle = styled('h4')(({ theme }) => ({
  margin: 0,
  marginBottom: theme.spacing(0.5),
  fontSize: 10,
  fontWeight: 900,
  color: theme.palette.produza.slate500,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
}));

export const ValidationAlertText = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 12,
  color: theme.palette.produza.onSurfaceVariant,
  lineHeight: 1.6,
}));

export const FormActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  color: theme.palette.produza.secondary,
  borderRadius: 6,
  '&:hover': {
    backgroundColor: `${theme.palette.produza.secondary}1A`,
  },
}));

export const SaveButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  color: theme.palette.produza.onPrimary,
  backgroundColor: theme.palette.produza.primary,
  borderRadius: 6,
  boxShadow: `0 10px 15px -3px ${theme.palette.produza.primary}33`,
  '&:hover': {
    opacity: 0.9,
    backgroundColor: theme.palette.produza.primary,
  },
  '&:active': { transform: 'scale(0.95)' },
  '&.MuiButton-root.Mui-disabled, &.MuiButton-contained.Mui-disabled, &.MuiButton-containedPrimary.Mui-disabled':
    {
      color: theme.palette.produza.onPrimary,
      WebkitTextFillColor: theme.palette.produza.onPrimary,
      background: theme.palette.produza.disabledPrimary,
      backgroundImage: 'none',
      backgroundColor: theme.palette.produza.disabledPrimary,
      boxShadow: 'none',
      opacity: 1,
    },
}));
