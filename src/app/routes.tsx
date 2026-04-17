import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/app/HomePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
