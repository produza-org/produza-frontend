import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const SelectDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: `${theme.palette.produza.primary}33`,
    backdropFilter: 'blur(6px)',
  },
  '& .MuiDialog-paper': {
    borderRadius: 12,
    backgroundColor: theme.palette.produza.surfaceContainerLowest,
    boxShadow: '0 16px 40px rgba(0, 23, 54, 0.18)',
    width: '100%',
    maxWidth: 760,
    margin: theme.spacing(2),
    maxHeight: 'calc(100% - 32px)',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 2.5, 1.5),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3, 3, 2),
  },
}));

export const ModalTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 800,
  color: theme.palette.produza.onSurface,
}));

export const ModalSubtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  fontSize: 13,
  fontWeight: 600,
  color: theme.palette.produza.onSurfaceVariant,
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.produza.onSurfaceVariant,
}));

export const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2.5, 2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minHeight: 0,
  flex: 1,
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 3, 2),
  },
}));

export const SearchFieldWrap = styled('div')(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.produza.surfaceContainerLow,
    borderRadius: 8,
    fontSize: 14,
    '& fieldset': {
      borderColor: `${theme.palette.produza.outlineVariant}80`,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.produza.outlineVariant,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.produza.primary,
      borderWidth: 1,
    },
  },
}));

export const TableShell = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  overflow: 'hidden',
  minHeight: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

export const TableScroll = styled(Box)(() => ({
  width: '100%',
  overflow: 'auto',
  flex: 1,
}));

export const DataTable = styled(Table)(() => ({
  minWidth: 560,
}));

export const HeadCell = styled(TableCell)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.slate500,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  borderBottom: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
}));

export const BodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 600,
  color: theme.palette.produza.onSurface,
  borderBottom: `1px solid ${theme.palette.produza.outlineVariant}33`,
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
}));

export const QtyInput = styled('input')(({ theme }) => ({
  width: '100%',
  maxWidth: 88,
  border: `1px solid ${theme.palette.produza.outlineVariant}80`,
  borderRadius: 8,
  padding: theme.spacing(0.875),
  fontSize: 13,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  color: theme.palette.produza.onSurface,
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  outline: 'none',
  '&:focus': {
    borderColor: theme.palette.produza.primary,
  },
  '&:disabled': {
    opacity: 0.5,
  },
}));

export const ModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5, 2.5),
  borderTop: `1px solid ${theme.palette.produza.outlineVariant}33`,
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3, 3),
  },
}));

export const SelectedCount = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 700,
  color: theme.palette.produza.onSurfaceVariant,
}));

export const FooterActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: theme.spacing(1.5),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    width: 'auto',
    justifyContent: 'flex-end',
  },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: 6,
  color: theme.palette.produza.secondary,
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

export const ConfirmButton = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: 6,
  color: theme.palette.produza.onPrimary,
  backgroundColor: theme.palette.produza.primary,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.produza.primaryContainer,
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    color: theme.palette.produza.onPrimary,
    backgroundColor: theme.palette.produza.disabledPrimary,
  },
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

export const PagerRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.produza.outlineVariant}33`,
}));

export const PagerButton = styled(Button)(({ theme }) => ({
  minWidth: 34,
  minHeight: 34,
  borderRadius: 8,
  fontWeight: 700,
  textTransform: 'none',
  color: theme.palette.produza.secondary,
  borderColor: `${theme.palette.produza.outlineVariant}80`,
}));
