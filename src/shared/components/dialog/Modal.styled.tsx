import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 12,
    backgroundColor: theme.palette.produza.surfaceContainerLowest,
    boxShadow: '0 10px 15px -3px rgba(0, 23, 54, 0.15)',
    maxWidth: 440,
    width: '100%',
    margin: theme.spacing(2),
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(3, 3, 1.5),
  fontSize: 18,
  fontWeight: 700,
  color: theme.palette.produza.onSurface,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(1.5, 3, 2),
  fontSize: 14,
  color: theme.palette.produza.onSurfaceVariant,
  lineHeight: 1.5,
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1.5, 3, 3),
  justifyContent: 'space-between',
  gap: 0,
}));

export const ModalCancelButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: 14,
  borderRadius: 6,
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.produza.secondary,
  borderColor: theme.palette.produza.outlineVariant,
  '&:hover': {
    borderColor: theme.palette.produza.outlineVariant,
    backgroundColor: `${theme.palette.produza.secondary}1A`,
  },
}));

export const ModalConfirmButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: 14,
  borderRadius: 6,
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.common.white,
  backgroundColor: theme.palette.produza.confirm,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.produza.confirmHover,
    boxShadow: 'none',
  },
}));
