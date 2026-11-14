import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

export const EditorCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  boxShadow: '0 12px 32px rgba(0, 27, 61, 0.04)',
}));

export const EditorCardAccent = styled(Box)(({ theme }) => ({
  height: 6,
  width: '100%',
  background: `linear-gradient(to right, ${theme.palette.produza.primary}, ${theme.palette.produza.primaryContainer})`,
}));

export const EditorBody = styled('form')(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

export const ProductMetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
}));

export const ProductMetaChip = styled(Chip)(({ theme }) => ({
  height: 28,
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 700,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  color: theme.palette.produza.onSurfaceVariant,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
}));

export const CategoryBlockRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  borderRadius: 12,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
}));

export const CategoryHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const CategoryTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.slate500,
}));

export const AddLineButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: 13,
  color: theme.palette.produza.primary,
  borderRadius: 6,
  '&:hover': {
    backgroundColor: `${theme.palette.produza.primary}14`,
  },
}));

export const LineRows = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const LineRowRoot = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  alignItems: 'end',
  padding: theme.spacing(2),
  borderRadius: 10,
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) 96px 40px',
  },
}));

export const RemoveLineButton = styled(Button)(({ theme }) => ({
  minWidth: 40,
  width: 40,
  height: 40,
  padding: 0,
  borderRadius: 6,
  color: theme.palette.produza.error,
  '&:hover': {
    backgroundColor: `${theme.palette.produza.error}14`,
  },
}));

export const ProportionSumBanner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  borderRadius: 12,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  color: theme.palette.produza.onSurface,
}));

export const ProportionSumLabel = styled('span')(({ theme }) => ({
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.produza.onSurfaceVariant,
}));

export const ProportionSumValue = styled('span')(({ theme }) => ({
  fontSize: 18,
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
  color: theme.palette.produza.onSurface,
}));

export const EmptyHint = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 13,
  color: theme.palette.produza.onSurfaceVariant,
  lineHeight: 1.6,
}));

export const EditorActions = styled(Box)(({ theme }) => ({
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
