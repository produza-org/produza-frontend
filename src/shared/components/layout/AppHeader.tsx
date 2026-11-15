import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PaletteMode } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage, type AppLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/core/store/useAuthStore';

const settingsRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  py: 1.25,
  px: 2,
  minHeight: 52,
  cursor: 'default',
} as const;

const toggleGroupSx = {
  flexShrink: 0,
  '& .MuiToggleButton-root': {
    px: 1.25,
    py: 0.5,
    minWidth: 44,
    lineHeight: 1,
  },
} as const;

export type AppHeaderProps = {
  showNavButton?: boolean;
  onOpenNav?: () => void;
};

export function AppHeader({
  showNavButton = false,
  onOpenNav,
}: AppHeaderProps) {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useThemeMode();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleThemeChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: PaletteMode | null) => {
      if (value && value !== mode) toggleTheme();
    },
    [mode, toggleTheme]
  );

  const handleLanguageChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: AppLanguage | null) => {
      if (value) setLanguage(value);
    },
    [setLanguage]
  );

  const handleLogout = useCallback(() => {
    handleCloseMenu();
    clearSession();
    navigate('/login', { replace: true });
  }, [clearSession, handleCloseMenu, navigate]);

  return (
    <AppBar position="sticky" color="default">
      <Toolbar
        variant="dense"
        sx={{ justifyContent: 'space-between', gap: 1.5, minHeight: 56 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
          {showNavButton ? (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onOpenNav}
              aria-label={t('layout.nav.openMenu')}
              size="small"
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            {user ? (
              <Stack spacing={0} sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user.organizationName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  title={user.email}
                >
                  {user.email}
                </Typography>
              </Stack>
            ) : null}
          </Box>
        </Box>
        <IconButton
          onClick={handleOpenMenu}
          color="inherit"
          aria-label={t('layout.settings.open')}
          aria-controls={menuOpen ? 'app-settings-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          size="small"
        >
          <SettingsOutlined />
        </IconButton>
        <Menu
          id="app-settings-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                minWidth: { xs: 0, sm: 280 },
                maxWidth: 'calc(100vw - 32px)',
                width: { xs: 'min(100vw - 32px, 320px)', sm: 'auto' },
              },
            },
          }}
        >
          <MenuList dense autoFocusItem={false} sx={{ py: 0 }}>
            <MenuItem
              disableRipple
              component="div"
              sx={settingsRowSx}
              onClick={(e) => e.stopPropagation()}
            >
              <ListItemText
                primary={t('layout.settings.theme')}
                slotProps={{
                  primary: { variant: 'body2', fontWeight: 600 },
                }}
                sx={{ flex: '1 1 auto', m: 0, minWidth: 0 }}
              />
              <ToggleButtonGroup
                exclusive
                size="small"
                value={mode}
                onChange={handleThemeChange}
                onClick={(e) => e.stopPropagation()}
                sx={toggleGroupSx}
              >
                <ToggleButton value="light" aria-label={t('theme.light')}>
                  <LightModeOutlined fontSize="small" />
                </ToggleButton>
                <ToggleButton value="dark" aria-label={t('theme.dark')}>
                  <DarkModeOutlined fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </MenuItem>
            <Divider component="li" sx={{ my: 0 }} />
            <MenuItem
              disableRipple
              component="div"
              sx={settingsRowSx}
              onClick={(e) => e.stopPropagation()}
            >
              <ListItemText
                primary={t('language.label')}
                slotProps={{
                  primary: { variant: 'body2', fontWeight: 600 },
                }}
                sx={{ flex: '1 1 auto', m: 0, minWidth: 0 }}
              />
              <ToggleButtonGroup
                exclusive
                size="small"
                value={language}
                onChange={handleLanguageChange}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  ...toggleGroupSx,
                  '& .MuiToggleButton-root': {
                    ...toggleGroupSx['& .MuiToggleButton-root'],
                    fontSize: '1.35rem',
                  },
                }}
              >
                <ToggleButton value="pt" aria-label={t('language.pt')}>
                  🇧🇷
                </ToggleButton>
                <ToggleButton value="en" aria-label={t('language.en')}>
                  🇺🇸
                </ToggleButton>
              </ToggleButtonGroup>
            </MenuItem>
            <Divider component="li" sx={{ my: 0 }} />
            <MenuItem
              disableRipple
              component="div"
              sx={{ ...settingsRowSx, justifyContent: 'stretch' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                fullWidth
                color="inherit"
                startIcon={<LogoutOutlined />}
                onClick={handleLogout}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                {t('auth.logout')}
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
