import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { GROUPING_CARD_SIZE_PX } from '@/features/groupings/constants';

export const CardsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(4),
  gridTemplateColumns: `repeat(
    auto-fill,
    minmax(min(100%, ${GROUPING_CARD_SIZE_PX}px), ${GROUPING_CARD_SIZE_PX}px)
  )`,
  justifyContent: 'start',
  alignItems: 'start',
}));

export const GroupCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: GROUPING_CARD_SIZE_PX,
  aspectRatio: '2 / 1',
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
  flexShrink: 0,
  height: 4,
  width: '100%',
  backgroundColor: theme.palette.produza.primary,
}));

export const GroupCardBody = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.5, 1.75),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1.75, 2),
  },
}));

export const GroupCardHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  minHeight: 0,
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
  fontSize: 16,
  fontWeight: 800,
  lineHeight: 1.25,
  color: theme.palette.produza.onSurface,
  overflowWrap: 'anywhere',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

export const GroupCardStats = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1),
  flexShrink: 0,
}));

export const GroupCardStat = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: theme.spacing(1, 1.25),
  borderRadius: 8,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  minWidth: 0,
}));

export const GroupCardStatLabel = styled(Typography)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.onSurfaceVariant,
}));

export const GroupCardStatValue = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 800,
  lineHeight: 1.2,
  fontVariantNumeric: 'tabular-nums',
  color: theme.palette.produza.onSurface,
  overflowWrap: 'anywhere',
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
