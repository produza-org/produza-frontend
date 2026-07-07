import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const PageTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontSize: 30,
  fontWeight: 900,
  color: theme.palette.produza.onSurface,
  letterSpacing: '-0.04em',
  lineHeight: 1.15,
}));

export const PageSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.produza.onSurfaceVariant,
  marginTop: theme.spacing(0.5),
}));
