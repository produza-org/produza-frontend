import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

export const ActionsMenuTrigger = styled(IconButton)(({ theme }) => ({
  padding: '6px',
  color: theme.palette.produza.slate400,
  borderRadius: 4,
  cursor: 'pointer',
  '&:hover': {
    cursor: 'pointer',
    color: theme.palette.produza.primary,
    backgroundColor: theme.palette.produza.surfaceContainerLow,
  },
}));

export const ActionsMenuPaperSx = {
  minWidth: 180,
  borderRadius: 2,
  boxShadow: '0 10px 15px -3px rgba(0, 23, 54, 0.12)',
} as const;

export const ActionsMenuItemRoot = styled(MenuItem, {
  shouldForwardProp: (p) => p !== '$tone',
})<{ $tone?: 'default' | 'danger' }>(({ theme, $tone }) => ({
  fontSize: 14,
  fontWeight: 500,
  gap: theme.spacing(1),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  color: $tone === 'danger' ? theme.palette.produza.error : theme.palette.produza.onSurface,
  '&:hover': {
    backgroundColor:
      $tone === 'danger'
        ? `${theme.palette.produza.errorContainer}4D`
        : theme.palette.produza.surfaceContainerLow,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 28,
    color: $tone === 'danger' ? theme.palette.produza.error : theme.palette.produza.secondary,
  },
}));

export const ActionsMenuItemIcon = styled(ListItemIcon)(() => ({
  minWidth: 28,
}));

export const ActionsMenuItemLabel = styled(ListItemText)(() => ({
  margin: 0,
  '& .MuiListItemText-primary': {
    fontSize: 14,
    fontWeight: 500,
  },
}));

export const StyledActionsMenu = styled(Menu)(() => ({
  '& .MuiList-root': {
    paddingTop: 4,
    paddingBottom: 4,
  },
}));
