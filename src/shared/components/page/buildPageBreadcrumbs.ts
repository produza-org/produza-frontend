export type PageBreadcrumbMatch = {
  pathname: string;
  crumb: string;
};

export type PageBreadcrumbItem = {
  labelKey: string;
  to: string | null;
};

export function buildPageBreadcrumbs(
  routeCrumbs: PageBreadcrumbMatch[]
): PageBreadcrumbItem[] {
  if (routeCrumbs.length === 0) {
    return [{ labelKey: 'layout.breadcrumbs.home', to: null }];
  }

  return [
    { labelKey: 'layout.breadcrumbs.home', to: '/' },
    ...routeCrumbs.map((crumb, index) => ({
      labelKey: crumb.crumb,
      to: index === routeCrumbs.length - 1 ? null : crumb.pathname,
    })),
  ];
}
