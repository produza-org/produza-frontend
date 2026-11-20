export function scrollToFirstError(fieldIds: string[]): void {
  for (const fieldId of fieldIds) {
    const element =
      document.getElementById(fieldId) ??
      document.querySelector<HTMLElement>(`[name="${fieldId}"]`);
    if (!element) {
      continue;
    }
    if (typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (typeof element.focus === 'function') {
      element.focus({ preventScroll: true });
    }
    return;
  }
}
