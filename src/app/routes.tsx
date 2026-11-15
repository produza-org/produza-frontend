import { Routes, Route, Outlet } from 'react-router-dom';
import { AppShellLayout } from '@/app/AppShellLayout';
import { HomePage } from '@/app/HomePage';
import { RequireAuth } from '@/app/RequireAuth';
import { LoginPage } from '@/features/auth';
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
import type { PageBreadcrumbHandle } from '@/shared/components/page';

const rawMaterialsCrumb = {
  crumb: 'layout.nav.rawMaterials',
} satisfies PageBreadcrumbHandle;

const productsCrumb = {
  crumb: 'layout.nav.products',
} satisfies PageBreadcrumbHandle;

const productionOrdersCrumb = {
  crumb: 'layout.nav.productionOrders',
} satisfies PageBreadcrumbHandle;

const groupingsCrumb = {
  crumb: 'layout.nav.groupings',
} satisfies PageBreadcrumbHandle;

const newCrumb = {
  crumb: 'layout.breadcrumbs.new',
} satisfies PageBreadcrumbHandle;

const editCrumb = {
  crumb: 'layout.breadcrumbs.edit',
} satisfies PageBreadcrumbHandle;

const recipeCrumb = {
  crumb: 'layout.breadcrumbs.recipe',
} satisfies PageBreadcrumbHandle;

const detailCrumb = {
  crumb: 'layout.breadcrumbs.detail',
} satisfies PageBreadcrumbHandle;

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShellLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/raw-materials"
            handle={rawMaterialsCrumb}
            element={
              <RawMaterialsProvider>
                <Outlet />
              </RawMaterialsProvider>
            }
          >
            <Route index element={<RawMaterialsListPage />} />
            <Route path="new" element={<RawMaterialCreatePage />} handle={newCrumb} />
            <Route
              path=":id/edit"
              element={<RawMaterialEditPage />}
              handle={editCrumb}
            />
          </Route>
          <Route
            path="/products"
            handle={productsCrumb}
            element={
              <ProductsProvider>
                <Outlet />
              </ProductsProvider>
            }
          >
            <Route index element={<ProductsListPage />} />
            <Route path="new" element={<ProductCreatePage />} handle={newCrumb} />
            <Route path=":id/edit" element={<ProductEditPage />} handle={editCrumb} />
            <Route
              path=":id/recipe"
              element={<ProductRecipePage />}
              handle={recipeCrumb}
            />
          </Route>
          <Route
            path="/production-orders"
            handle={productionOrdersCrumb}
            element={
              <ProductionOrdersProvider>
                <Outlet />
              </ProductionOrdersProvider>
            }
          >
            <Route index element={<ProductionOrdersListPage />} />
            <Route
              path="new"
              element={<ProductionOrderCreatePage />}
              handle={newCrumb}
            />
            <Route
              path=":id"
              element={<ProductionOrderDetailPage />}
              handle={detailCrumb}
            />
          </Route>
          <Route path="/groupings" element={<HomePage />} handle={groupingsCrumb} />
        </Route>
      </Route>
    </Routes>
  );
}
