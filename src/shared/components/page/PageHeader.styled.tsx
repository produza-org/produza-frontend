import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const PageRoot = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

export const PageTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontSize: 22,
  fontWeight: 900,
  color: theme.palette.produza.onSurface,
  letterSpacing: '-0.04em',
  lineHeight: 1.15,
  overflowWrap: 'anywhere',
  [theme.breakpoints.up('sm')]: {
    fontSize: 26,
  },
  [theme.breakpoints.up('md')]: {
    fontSize: 30,
  },
}));

export const PageSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.produza.onSurfaceVariant,
  marginTop: theme.spacing(0.5),
}));
