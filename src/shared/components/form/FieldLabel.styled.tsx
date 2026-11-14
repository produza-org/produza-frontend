import { styled } from '@mui/material/styles';

export const FieldLabel = styled('label')(({ theme }) => ({
  display: 'block',
  fontSize: 10,
  fontWeight: 900,
  color: theme.palette.produza.slate600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: theme.spacing(1),
}));
