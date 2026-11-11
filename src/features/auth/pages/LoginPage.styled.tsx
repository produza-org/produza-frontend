import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const LoginPageRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  background: `linear-gradient(
    160deg,
    ${theme.palette.produza.surfaceContainerLow} 0%,
    ${theme.palette.produza.surface} 45%,
    ${theme.palette.produza.slate100} 100%
  )`,
}));

export const LoginCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 420,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.produza.outlineVariant}`,
}));
