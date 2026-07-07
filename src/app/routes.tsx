import { Routes, Route, Outlet } from 'react-router-dom';
import { AppShellLayout } from '@/app/AppShellLayout';
import { HomePage } from '@/app/HomePage';
import {
  RawMaterialsListPage,
  RawMaterialCreatePage,
  RawMaterialsProvider,
} from '@/features/raw-materials';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/raw-materials"
          element={
            <RawMaterialsProvider>
              <Outlet />
            </RawMaterialsProvider>
          }
        >
          <Route index element={<RawMaterialsListPage />} />
          <Route path="new" element={<RawMaterialCreatePage />} />
        </Route>
        <Route path="/groupings" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
