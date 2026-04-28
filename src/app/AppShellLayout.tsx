import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { AppFooter } from '@/shared/components/layout/AppFooter';
import { AppHeader } from '@/shared/components/layout/AppHeader';
import { AppSidebar } from '@/shared/components/layout/AppSidebar';

const STORAGE_KEY = 'produza-sidebar-collapsed';

function readCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

export function AppShellLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
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
        <AppHeader />
        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            bgcolor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
        <AppFooter />
      </Box>
    </Box>
  );
}
