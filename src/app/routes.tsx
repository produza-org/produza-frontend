import { Routes, Route, Outlet } from 'react-router-dom';
import { AppShellLayout } from '@/app/AppShellLayout';
import { RequireAuth } from '@/app/RequireAuth';
import { LoginPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import {
  ProductsListPage,
  ProductCreatePage,
  ProductEditPage,
  ProductRecipePage,
  ProductsProvider,
} from '@/features/products';
import {
  ProductionOrdersListPage,
  ProductionOrderCreatePage,
  ProductionOrderDetailPage,
  ProductionOrdersProvider,
} from '@/features/production-orders';
import {
  RawMaterialsListPage,
  RawMaterialCreatePage,
  RawMaterialEditPage,
  RawMaterialsProvider,
} from '@/features/raw-materials';
import {
  GroupingsListPage,
  GroupingCreatePage,
  GroupingEditPage,
  GroupingsProvider,
} from '@/features/groupings';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShellLayout />}>
          <Route path="/" element={<DashboardPage />} />
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
            <Route path=":id/recipe" element={<ProductRecipePage />} />
          </Route>
          <Route
            path="/production-orders"
            element={
              <ProductionOrdersProvider>
                <Outlet />
              </ProductionOrdersProvider>
            }
          >
            <Route index element={<ProductionOrdersListPage />} />
            <Route path="new" element={<ProductionOrderCreatePage />} />
            <Route path=":id" element={<ProductionOrderDetailPage />} />
          </Route>
          <Route
            path="/groupings"
            element={
              <GroupingsProvider>
                <Outlet />
              </GroupingsProvider>
            }
          >
            <Route index element={<GroupingsListPage />} />
            <Route path="new" element={<GroupingCreatePage />} />
            <Route path=":id/edit" element={<GroupingEditPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
