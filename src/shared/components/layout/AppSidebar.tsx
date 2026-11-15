import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import SpaceDashboardOutlined from '@mui/icons-material/SpaceDashboardOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import PrecisionManufacturingOutlined from '@mui/icons-material/PrecisionManufacturingOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import {
  DRAWER_WIDTH_COLLAPSED,
  DRAWER_WIDTH_EXPANDED,
} from '@/shared/constants';

const RAIL_ICON_SLOT_PX = 40;

const navConfig = [
  { to: '/', i18nKey: 'layout.nav.dashboard', Icon: SpaceDashboardOutlined },
  {
    to: '/raw-materials',
    i18nKey: 'layout.nav.rawMaterials',
    Icon: Inventory2Outlined,
  },
  {
    to: '/products',
    i18nKey: 'layout.nav.products',
    Icon: CategoryOutlined,
  },
  {
    to: '/production-orders',
    i18nKey: 'layout.nav.productionOrders',
    Icon: PrecisionManufacturingOutlined,
  },
  {
    to: '/groupings',
    i18nKey: 'layout.nav.groupings',
    Icon: AccountTreeOutlined,
  },
] as const;

export type AppSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  isDesktop: boolean;
};

export function AppSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
  isDesktop,
}: AppSidebarProps) {
  const { t } = useTranslation();
  const showCollapsed = isDesktop && collapsed;
  const width = showCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;
  const brand = t('layout.header.productName');

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        pt: 1,
      }}
    >
      <Box
        component="header"
        sx={
          showCollapsed
            ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75,
                px: 0.5,
                pb: 3,
              }
            : {
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                px: 0.5,
                pb: 3,
                minHeight: 48,
              }
        }
      >
        {showCollapsed ? (
          <Tooltip title={brand} placement="right">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                typography: 'subtitle2',
                fontWeight: 700,
              }}
              aria-label={brand}
            >
              P
            </Avatar>
          </Tooltip>
        ) : (
          <>
            <Box
              sx={{
                width: RAIL_ICON_SLOT_PX,
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
              }}
              aria-hidden
            />
            <Typography
              component="h2"
              variant="h6"
              noWrap
              aria-label={brand}
              sx={{
                flex: 1,
                minWidth: 0,
                textAlign: 'center',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              {brand}
            </Typography>
            <Box
              sx={{
                width: RAIL_ICON_SLOT_PX,
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {isDesktop ? (
                <Tooltip
                  title={t('layout.nav.collapseSidebar')}
                  placement="right"
                >
                  <IconButton
                    onClick={onToggleCollapsed}
                    aria-label={t('layout.nav.collapseSidebar')}
                    size="small"
                  >
                    <ChevronLeft />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Box>
          </>
        )}
        {showCollapsed ? (
          <Tooltip title={t('layout.nav.expandSidebar')} placement="right">
            <IconButton
              onClick={onToggleCollapsed}
              aria-label={t('layout.nav.expandSidebar')}
              size="small"
            >
              <ChevronRight />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      <List component="nav" disablePadding sx={{ flex: 1, px: 0.5 }}>
        {navConfig.map(({ to, i18nKey, Icon }) => {
          const label = t(i18nKey);
          const item = (
            <ListItemButton
              key={to}
              component={NavLink}
              to={to}
              end={to === '/'}
              onClick={isDesktop ? undefined : onMobileClose}
              sx={{
                borderRadius: 1,
                justifyContent: showCollapsed ? 'center' : 'flex-start',
                px: showCollapsed ? 1 : 2,
                minHeight: 48,
                '&.active': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: showCollapsed ? 0 : 40,
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              {!showCollapsed ? (
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 600,
                    noWrap: true,
                  }}
                />
              ) : null}
            </ListItemButton>
          );

          return showCollapsed ? (
            <Tooltip key={to} title={label} placement="right">
              {item}
            </Tooltip>
          ) : (
            item
          );
        })}
      </List>
    </Box>
  );

  if (!isDesktop) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH_EXPANDED,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={(theme) => ({
        display: { xs: 'none', md: 'block' },
        width,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width,
          position: 'relative',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
        },
      })}
    >
      {drawerContent}
    </Drawer>
  );
}
