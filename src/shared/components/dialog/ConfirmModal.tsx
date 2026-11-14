import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Modal } from './Modal';
import { ModalCancelButton, ModalConfirmButton } from './Modal.styled';

export type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  message,
  title,
  cancelLabel,
  confirmLabel,
  confirmDisabled = false,
  confirmLoading = false,
}: ConfirmModalProps) {
  const busy = confirmDisabled || confirmLoading;

  const handleClose = () => {
    if (confirmLoading) {
      return;
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      actions={
        <>
          <ModalCancelButton variant="outlined" onClick={handleClose} disabled={busy}>
            {cancelLabel}
          </ModalCancelButton>
          <ModalConfirmButton
            variant="contained"
            disableElevation
            onClick={onConfirm}
            disabled={busy}
            aria-busy={confirmLoading || undefined}
            aria-label={confirmLoading ? confirmLabel : undefined}
            sx={{ minWidth: 112 }}
          >
            {confirmLoading ? (
              <CircularProgress size={18} color="inherit" aria-hidden />
            ) : (
              confirmLabel
            )}
          </ModalConfirmButton>
        </>
      }
    >
      <Typography component="p" sx={{ m: 0, fontSize: 14, lineHeight: 1.5 }}>
        {message}
      </Typography>
    </Modal>
  );
}
