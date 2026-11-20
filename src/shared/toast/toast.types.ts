export type ToastSeverity = 'success' | 'error';

export type ToastInput = {
  severity: ToastSeverity;
  message: string;
  autoHideDuration?: number;
};

export type ToastState = ToastInput & {
  open: boolean;
  autoHideDuration: number;
};

export type ToastContextValue = {
  enqueueToast: (input: ToastInput) => void;
};

export const TOAST_SUCCESS_AUTO_HIDE_MS = 4000;
export const TOAST_ERROR_AUTO_HIDE_MS = 7000;

export function resolveToastAutoHideDuration(
  severity: ToastSeverity,
  autoHideDuration?: number
): number {
  if (typeof autoHideDuration === 'number' && Number.isFinite(autoHideDuration)) {
    return autoHideDuration;
  }
  return severity === 'error'
    ? TOAST_ERROR_AUTO_HIDE_MS
    : TOAST_SUCCESS_AUTO_HIDE_MS;
}
