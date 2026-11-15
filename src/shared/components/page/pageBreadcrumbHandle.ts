export type PageBreadcrumbHandle = {
  crumb: string;
};

export function getCrumbFromHandle(handle: unknown): string | null {
  if (
    handle &&
    typeof handle === 'object' &&
    'crumb' in handle &&
    typeof (handle as { crumb: unknown }).crumb === 'string'
  ) {
    return (handle as { crumb: string }).crumb;
  }
  return null;
}
