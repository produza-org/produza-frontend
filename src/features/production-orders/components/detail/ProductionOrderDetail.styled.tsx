import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

export const DetailCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  boxShadow: '0 12px 32px rgba(0, 27, 61, 0.04)',
}));

export const DetailCardAccent = styled(Box)(({ theme }) => ({
  height: 6,
  width: '100%',
  background: `linear-gradient(to right, ${theme.palette.produza.primary}, ${theme.palette.produza.primaryContainer})`,
}));

export const DetailBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    gap: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

export const HeaderGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
}));

export const MetaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(2),
  borderRadius: 10,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
}));

export const MetaLabel = styled('span')(({ theme }) => ({
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.palette.produza.slate500,
}));

export const MetaValue = styled('span')(({ theme }) => ({
  fontSize: 14,
  fontWeight: 700,
  color: theme.palette.produza.onSurface,
  fontVariantNumeric: 'tabular-nums',
}));

export const QControls = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr',
  alignItems: 'end',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(0, 220px) auto auto',
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  width: '100%',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: 6,
  color: theme.palette.produza.onPrimary,
  backgroundColor: theme.palette.produza.primary,
  boxShadow: `0 10px 15px -3px ${theme.palette.produza.primary}33`,
  '&:hover': {
    opacity: 0.9,
    backgroundColor: theme.palette.produza.primary,
  },
  '&:active': { transform: 'scale(0.98)' },
  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}));

export const SecondaryActionButton = styled(Button)(({ theme }) => ({
  width: '100%',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: 6,
  color: theme.palette.produza.primary,
  border: `1px solid ${theme.palette.produza.outlineVariant}`,
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  '&:hover': {
    backgroundColor: `${theme.palette.produza.primary}14`,
  },
  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}));

export const NeedsTableScroll = styled(Box)(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  marginTop: theme.spacing(4),
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

export const CategoryTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.slate500,
}));

export const NeedsTable = styled(Table)(() => ({
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'transparent',
  '& .MuiTableCell-root': { borderBottom: 'none' },
}));

export const NeedsHeadCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  backgroundColor: theme.palette.produza.surfaceContainerHigh,
  color: theme.palette.produza.onSurfaceVariant,
  fontSize: 10,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}));

export const NeedsBodyRow = styled(TableRow, {
  shouldForwardProp: (p) => p !== '$striped',
})<{ $striped?: boolean }>(({ theme, $striped }) => ({
  backgroundColor: $striped
    ? `${theme.palette.produza.surfaceContainerLowest}CC`
    : theme.palette.produza.surfaceContainerLowest,
}));

export const NeedsCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  fontSize: 13,
  color: theme.palette.produza.onSurface,
}));

export const NeedsNumericCell = styled(NeedsCell)(() => ({
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 700,
}));

export const EmptyLines = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 13,
  color: theme.palette.produza.onSurfaceVariant,
}));
