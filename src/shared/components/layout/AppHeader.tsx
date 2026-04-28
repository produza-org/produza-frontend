import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PaletteMode } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage, type AppLanguage } from '@/contexts/LanguageContext';

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

export function AppHeader() {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useThemeMode();
  const { language, setLanguage } = useLanguage();
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

  return (
    <AppBar position="sticky" color="default">
      <Toolbar variant="dense" sx={{ justifyContent: 'flex-end', minHeight: 56 }}>
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
              sx: { minWidth: 280 },
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
          </MenuList>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
