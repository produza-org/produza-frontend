import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const TableShell = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  borderRadius: 12,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  overflow: 'hidden',
}));

export const TableScroll = styled(Box)(() => ({
  width: '100%',
  overflowX: 'auto',
}));

export const DataTable = styled(Table)(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  '& .MuiTableCell-root': { borderBottom: 'none' },
  '& .MuiTableBody-root .MuiTableCell-root': { fontSize: 14 },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTableCell-root': {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
  },
}));

export const HeadCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  backgroundColor: theme.palette.produza.surfaceContainerHigh,
  color: theme.palette.produza.onSurfaceVariant,
  fontSize: 10,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  borderBottom: 'none',
}));

export const BodyRow = styled(TableRow, {
  shouldForwardProp: (p) => p !== '$striped',
})<{ $striped?: boolean }>(({ theme, $striped }) => ({
  cursor: 'pointer',
  transition: 'background-color 150ms ease',
  '&:hover': { backgroundColor: theme.palette.produza.surfaceContainerLow },
  ...($striped
    ? { backgroundColor: `${theme.palette.produza.surfaceContainerLow}4D` }
    : { backgroundColor: 'transparent' }),
}));

export const NumberCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  fontWeight: 700,
  color: theme.palette.produza.primary,
}));

export const NameCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.produza.onSurface,
}));

export const NumericCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
}));

export const DateCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  color: theme.palette.produza.onSurfaceVariant,
}));

export const ActionsCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  textAlign: 'center',
}));

export const ActionsInner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

export const FooterBar = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.produza.slate100}`,
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    justifyContent: 'space-between',
  },
}));

export const FooterSummary = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.produza.slate500,
}));

export const PagerRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}));

export const PagerIconButton = styled(IconButton)(({ theme }) => ({
  padding: '6px',
  color: theme.palette.produza.slate400,
  borderRadius: 4,
  '&.Mui-disabled': { opacity: 0.3 },
  '&:hover': { backgroundColor: theme.palette.produza.slate100 },
}));

export const PageNumberActive = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.produza.primary,
  color: theme.palette.produza.onPrimary,
  fontSize: 12,
  fontWeight: 700,
  borderRadius: 4,
}));

export const PageNumberButton = styled('button')(({ theme }) => ({
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.produza.slate600,
  fontSize: 12,
  fontWeight: 700,
  borderRadius: 4,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.palette.produza.slate100 },
}));

export const PagerEllipsis = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  color: theme.palette.produza.slate400,
  fontSize: 12,
}));
