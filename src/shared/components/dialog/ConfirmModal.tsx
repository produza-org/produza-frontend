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
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <ModalCancelButton variant="outlined" onClick={onClose} disabled={confirmDisabled}>
            {cancelLabel}
          </ModalCancelButton>
          <ModalConfirmButton
            variant="contained"
            disableElevation
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
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
