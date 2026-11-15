import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const CardsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2.5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

export const GroupCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  boxShadow: '0 8px 20px rgba(0, 27, 61, 0.04)',
  cursor: 'pointer',
  transition: 'transform 120ms ease, box-shadow 120ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 28px rgba(0, 27, 61, 0.08)',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.produza.primary}`,
    outlineOffset: 2,
  },
}));

export const GroupCardAccent = styled(Box)(({ theme }) => ({
  height: 4,
  width: '100%',
  backgroundColor: theme.palette.produza.primary,
}));

export const GroupCardBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.75, 2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const GroupCardHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
}));

export const GroupCardCode = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.secondary,
  marginBottom: theme.spacing(0.5),
}));

export const GroupCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: 17,
  fontWeight: 800,
  lineHeight: 1.25,
  color: theme.palette.produza.onSurface,
  overflowWrap: 'anywhere',
}));

export const GroupCardStats = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1),
}));

export const GroupCardStat = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: theme.spacing(1, 1.25),
  borderRadius: 8,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
}));

export const GroupCardStatLabel = styled(Typography)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.onSurfaceVariant,
}));

export const GroupCardStatValue = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 800,
  lineHeight: 1.2,
  fontVariantNumeric: 'tabular-nums',
  color: theme.palette.produza.onSurface,
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 2),
  textAlign: 'center',
  color: theme.palette.produza.onSurfaceVariant,
  fontSize: 14,
  fontWeight: 600,
}));

export const FooterRoot = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  alignItems: 'stretch',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export const FooterSummary = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 600,
  color: theme.palette.produza.onSurfaceVariant,
}));

export const PagerRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  alignItems: 'center',
  justifyContent: 'flex-start',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-end',
  },
}));

export const PagerButton = styled(Button)(({ theme }) => ({
  minWidth: 36,
  minHeight: 36,
  paddingLeft: theme.spacing(1.25),
  paddingRight: theme.spacing(1.25),
  borderRadius: 8,
  fontWeight: 700,
  textTransform: 'none',
  color: theme.palette.produza.secondary,
  borderColor: `${theme.palette.produza.outlineVariant}80`,
  '&.Mui-disabled': {
    color: theme.palette.produza.outlineVariant,
  },
}));

export const PagerIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 8,
  border: `1px solid ${theme.palette.produza.outlineVariant}80`,
  color: theme.palette.produza.secondary,
  '&.Mui-disabled': {
    color: theme.palette.produza.outlineVariant,
  },
}));
