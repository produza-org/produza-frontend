import { describe, expect, it } from 'vitest';
import { buildPageBreadcrumbs } from './buildPageBreadcrumbs';

describe('buildPageBreadcrumbs', () => {
  it('returns only home as current when there are no route crumbs', () => {
    expect(buildPageBreadcrumbs([])).toEqual([
      { labelKey: 'layout.breadcrumbs.home', to: null },
    ]);
  });

  it('links home and prior crumbs, keeps the last crumb current', () => {
    expect(
      buildPageBreadcrumbs([
        { pathname: '/products', crumb: 'layout.nav.products' },
        { pathname: '/products/new', crumb: 'layout.breadcrumbs.new' },
      ])
    ).toEqual([
      { labelKey: 'layout.breadcrumbs.home', to: '/' },
      { labelKey: 'layout.nav.products', to: '/products' },
      { labelKey: 'layout.breadcrumbs.new', to: null },
    ]);
  });

  it('marks a single section crumb as current', () => {
    expect(
      buildPageBreadcrumbs([
        { pathname: '/raw-materials', crumb: 'layout.nav.rawMaterials' },
      ])
    ).toEqual([
      { labelKey: 'layout.breadcrumbs.home', to: '/' },
      { labelKey: 'layout.nav.rawMaterials', to: null },
    ]);
  });
});
