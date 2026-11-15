import { describe, expect, it } from 'vitest';
import { matchPageBreadcrumbs } from './matchPageBreadcrumbs';

describe('matchPageBreadcrumbs', () => {
  it('returns no route crumbs for the dashboard', () => {
    expect(matchPageBreadcrumbs('/')).toEqual([]);
  });

  it('matches section list pages', () => {
    expect(matchPageBreadcrumbs('/products')).toEqual([
      { pathname: '/products', crumb: 'layout.nav.products' },
    ]);
  });

  it('matches nested create and edit pages', () => {
    expect(matchPageBreadcrumbs('/raw-materials/new')).toEqual([
      { pathname: '/raw-materials', crumb: 'layout.nav.rawMaterials' },
      { pathname: '/raw-materials/new', crumb: 'layout.breadcrumbs.new' },
    ]);
    expect(matchPageBreadcrumbs('/products/abc/edit')).toEqual([
      { pathname: '/products', crumb: 'layout.nav.products' },
      { pathname: '/products/abc/edit', crumb: 'layout.breadcrumbs.edit' },
    ]);
  });

  it('matches production order detail without treating new as an id', () => {
    expect(matchPageBreadcrumbs('/production-orders/new')).toEqual([
      { pathname: '/production-orders', crumb: 'layout.nav.productionOrders' },
      { pathname: '/production-orders/new', crumb: 'layout.breadcrumbs.new' },
    ]);
    expect(matchPageBreadcrumbs('/production-orders/ord-1')).toEqual([
      { pathname: '/production-orders', crumb: 'layout.nav.productionOrders' },
      { pathname: '/production-orders/ord-1', crumb: 'layout.breadcrumbs.detail' },
    ]);
  });
});
