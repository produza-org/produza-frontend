import { useCallback, useState, type ReactNode } from 'react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import {
  ActionsMenuItemIcon,
  ActionsMenuItemLabel,
  ActionsMenuItemRoot,
  ActionsMenuPaperSx,
  ActionsMenuTrigger,
  StyledActionsMenu,
} from './ActionsMenu.styled';

export type ActionsMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
};

export type ActionsMenuProps = {
  ariaLabel: string;
  items: ActionsMenuItem[];
};

export function ActionsMenu({ ariaLabel, items }: ActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleTriggerClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (open) {
        setAnchorEl(null);
        return;
      }
      setAnchorEl(event.currentTarget);
    },
    [open]
  );

  const handleItemClick = useCallback(
    (item: ActionsMenuItem) => {
      handleClose();
      item.onClick();
    },
    [handleClose]
  );

  return (
    <>
      <ActionsMenuTrigger
        size="small"
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'shared-actions-menu' : undefined}
        onClick={handleTriggerClick}
      >
        <MoreHoriz sx={{ fontSize: 20 }} />
      </ActionsMenuTrigger>
      <StyledActionsMenu
        id="shared-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableAutoFocusItem
        slotProps={{
          paper: {
            sx: ActionsMenuPaperSx,
          },
        }}
      >
        {items.map((item) => (
          <ActionsMenuItemRoot
            key={item.id}
            $tone={item.tone ?? 'default'}
            disabled={item.disabled}
            onClick={() => handleItemClick(item)}
          >
            {item.icon ? <ActionsMenuItemIcon>{item.icon}</ActionsMenuItemIcon> : null}
            <ActionsMenuItemLabel primary={item.label} />
          </ActionsMenuItemRoot>
        ))}
      </StyledActionsMenu>
    </>
  );
}
