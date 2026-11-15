import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const PageRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 4, 4),
}));

export const HeroRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(5),
}));

export const AddProductButton = styled(Button)(({ theme }) => ({
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
    background: `linear-gradient(145deg, ${theme.palette.produza.primaryContainer} 0%, ${theme.palette.produza.primaryMid} 100%)`,
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
