import { Routes, Route } from 'react-router-dom';
import { AppShellLayout } from '@/app/AppShellLayout';
import { HomePage } from '@/app/HomePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/raw-materials" element={<HomePage />} />
        <Route path="/groupings" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
