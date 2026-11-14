export type ToastSeverity = 'success' | 'error';

export type ToastInput = {
  severity: ToastSeverity;
  message: string;
};

export type ToastState = ToastInput & {
  open: boolean;
};

export type ToastContextValue = {
  enqueueToast: (input: ToastInput) => void;
};
