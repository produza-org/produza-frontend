import type { ReactNode } from 'react';
import {
  StyledDialog,
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from './Modal.styled';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  return (
    <StyledDialog open={open} onClose={onClose} aria-labelledby={title ? 'shared-modal-title' : undefined}>
      {title ? <StyledDialogTitle id="shared-modal-title">{title}</StyledDialogTitle> : null}
      {children ? <StyledDialogContent>{children}</StyledDialogContent> : null}
      {actions ? <StyledDialogActions>{actions}</StyledDialogActions> : null}
    </StyledDialog>
  );
}
