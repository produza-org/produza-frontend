import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const PageRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export const HeroRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(5),
}));

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

export const AddMaterialButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  color: theme.palette.produza.onPrimary,
  background: `linear-gradient(145deg, ${theme.palette.produza.primary} 0%, ${theme.palette.produza.primaryContainer} 100%)`,
  boxShadow: '0 10px 15px -3px rgba(0, 23, 54, 0.2)',
  '&:hover': {
    background: `linear-gradient(145deg, ${theme.palette.produza.primaryContainer} 0%, #264778 100%)`,
    opacity: 0.95,
    boxShadow: '0 10px 15px -3px rgba(0, 23, 54, 0.2)',
  },
  '&:active': { transform: 'scale(0.98)' },
}));

export const StatsGrid = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  display: 'grid',
  gap: theme.spacing(3),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));
