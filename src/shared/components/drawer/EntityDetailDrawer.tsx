import type { ReactNode } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import {
  DrawerBody,
  DrawerCloseButton,
  DrawerFooter,
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
  DrawerTitleBlock,
  StyledDetailDrawer,
} from './EntityDetailDrawer.styled';

export type EntityDetailDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  closeAriaLabel: string;
};

export function EntityDetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  closeAriaLabel,
}: EntityDetailDrawerProps) {
  return (
    <StyledDetailDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: false,
      }}
      slotProps={{
        backdrop: {
          onClick: onClose,
        },
      }}
    >
      <DrawerHeader>
        <DrawerTitleBlock>
          <DrawerTitle component="h2">{title}</DrawerTitle>
          {subtitle ? <DrawerSubtitle>{subtitle}</DrawerSubtitle> : null}
        </DrawerTitleBlock>
        <DrawerCloseButton aria-label={closeAriaLabel} onClick={onClose} size="small">
          <CloseOutlined fontSize="small" />
        </DrawerCloseButton>
      </DrawerHeader>
      <DrawerBody>{children}</DrawerBody>
      {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
    </StyledDetailDrawer>
  );
}
