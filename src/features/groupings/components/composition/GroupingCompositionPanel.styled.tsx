import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const PanelRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const PanelToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  alignItems: 'stretch',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export const AddItemButton = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: 8,
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
  color: theme.palette.produza.onPrimary,
  backgroundColor: theme.palette.produza.primary,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.produza.primaryContainer,
    boxShadow: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

export const TableShell = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  overflow: 'hidden',
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
}));

export const TableScroll = styled(Box)(() => ({
  width: '100%',
  overflowX: 'auto',
}));

export const DataTable = styled(Table)(() => ({
  minWidth: 640,
}));

export const HeadCell = styled(TableCell)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.slate500,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  borderBottom: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

export const BodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 600,
  color: theme.palette.produza.onSurface,
  borderBottom: `1px solid ${theme.palette.produza.outlineVariant}33`,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

export const QtyInput = styled('input')<{ $error?: boolean }>(({ theme, $error }) => ({
  width: '100%',
  maxWidth: 96,
  border: `1px solid ${
    $error ? theme.palette.error.main : `${theme.palette.produza.outlineVariant}80`
  }`,
  borderRadius: 8,
  padding: theme.spacing(1),
  fontSize: 13,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  color: theme.palette.produza.onSurface,
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  outline: 'none',
  '&:focus': {
    borderColor: $error ? theme.palette.error.main : theme.palette.produza.primary,
  },
}));

export const QtyErrorText = styled('span')(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(0.5),
  fontSize: 12,
  color: theme.palette.error.main,
}));

export const RemoveButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.produza.error,
  '&:hover': {
    backgroundColor: `${theme.palette.produza.error}14`,
  },
}));

export const EmptyHint = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  textAlign: 'center',
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.produza.onSurfaceVariant,
}));

export const MaterialCode = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  fontSize: 11,
  fontWeight: 700,
  color: theme.palette.produza.secondary,
}));

export const TotalBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
}));

export const TotalLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.produza.secondary,
}));

export const TotalValue = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 900,
  fontVariantNumeric: 'tabular-nums',
  color: theme.palette.produza.onSurface,
}));

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
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));
