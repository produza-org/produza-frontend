import { matchPath } from 'react-router-dom';
import type { PageBreadcrumbMatch } from '@/shared/components/page/buildPageBreadcrumbs';

type BreadcrumbSection = {
  path: string;
  crumb: string;
  leaves: Array<{ pattern: string; crumb: string }>;
};

const BREADCRUMB_SECTIONS: BreadcrumbSection[] = [
  {
    path: '/raw-materials',
    crumb: 'layout.nav.rawMaterials',
    leaves: [
      { pattern: '/raw-materials/new', crumb: 'layout.breadcrumbs.new' },
      { pattern: '/raw-materials/:id/edit', crumb: 'layout.breadcrumbs.edit' },
    ],
  },
  {
    path: '/products',
    crumb: 'layout.nav.products',
    leaves: [
      { pattern: '/products/new', crumb: 'layout.breadcrumbs.new' },
      { pattern: '/products/:id/edit', crumb: 'layout.breadcrumbs.edit' },
      { pattern: '/products/:id/recipe', crumb: 'layout.breadcrumbs.recipe' },
    ],
  },
  {
    path: '/production-orders',
    crumb: 'layout.nav.productionOrders',
    leaves: [
      { pattern: '/production-orders/new', crumb: 'layout.breadcrumbs.new' },
      { pattern: '/production-orders/:id', crumb: 'layout.breadcrumbs.detail' },
    ],
  },
  {
    path: '/groupings',
    crumb: 'layout.nav.groupings',
    leaves: [],
  },
];

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

export function matchPageBreadcrumbs(pathname: string): PageBreadcrumbMatch[] {
  const normalized = normalizePathname(pathname);
  if (normalized === '/') {
    return [];
  }

  for (const section of BREADCRUMB_SECTIONS) {
    const inSection =
      normalized === section.path || normalized.startsWith(`${section.path}/`);
    if (!inSection) {
      continue;
    }

    const crumbs: PageBreadcrumbMatch[] = [
      { pathname: section.path, crumb: section.crumb },
    ];

    for (const leaf of section.leaves) {
      if (matchPath({ path: leaf.pattern, end: true }, normalized)) {
        crumbs.push({ pathname: normalized, crumb: leaf.crumb });
        break;
      }
    }

    return crumbs;
  }

  return [];
}
