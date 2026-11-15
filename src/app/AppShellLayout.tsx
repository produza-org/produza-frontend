import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AppFooter } from '@/shared/components/layout/AppFooter';
import { AppHeader } from '@/shared/components/layout/AppHeader';
import { AppSidebar } from '@/shared/components/layout/AppSidebar';
import { PageBreadcrumbs } from '@/shared/components/page';

const STORAGE_KEY = 'produza-sidebar-collapsed';

function readCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

export function AppShellLayout() {
  const theme = useTheme();
  const location = useLocation();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isDesktop) {
      setMobileOpen(false);
    }
  }, [isDesktop]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isDesktop={isDesktop}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        <AppHeader
          showNavButton={!isDesktop}
          onOpenNav={() => setMobileOpen(true)}
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              pt: { xs: 2, sm: 3, md: 4 },
              pb: 0,
            }}
          >
            <PageBreadcrumbs />
          </Box>
          <Outlet />
        </Box>
        <AppFooter />
      </Box>
    </Box>
  );
}
