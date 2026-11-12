import { Routes, Route, Outlet } from 'react-router-dom';
import { AppShellLayout } from '@/app/AppShellLayout';
import { HomePage } from '@/app/HomePage';
import { RequireAuth } from '@/app/RequireAuth';
import { LoginPage } from '@/features/auth';
import {
  ProductsListPage,
  ProductCreatePage,
  ProductEditPage,
  ProductsProvider,
} from '@/features/products';
import {
  RawMaterialsListPage,
  RawMaterialCreatePage,
  RawMaterialEditPage,
  RawMaterialsProvider,
} from '@/features/raw-materials';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
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
            <Route path=":id/edit" element={<RawMaterialEditPage />} />
          </Route>
          <Route
            path="/products"
            element={
              <ProductsProvider>
                <Outlet />
              </ProductsProvider>
            }
          >
            <Route index element={<ProductsListPage />} />
            <Route path="new" element={<ProductCreatePage />} />
            <Route path=":id/edit" element={<ProductEditPage />} />
          </Route>
          <Route path="/groupings" element={<HomePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
