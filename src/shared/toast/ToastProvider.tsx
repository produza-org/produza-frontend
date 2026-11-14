import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ToastContext } from './ToastContext';
import type { ToastInput, ToastState } from './toast.types';

const AUTO_HIDE_MS = 4000;

const INITIAL_TOAST: ToastState = {
  open: false,
  severity: 'success',
  message: '',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(INITIAL_TOAST);

  useEffect(() => {
    return () => {
      setToast(INITIAL_TOAST);
    };
  }, []);

  const enqueueToast = useCallback((input: ToastInput) => {
    setToast({
      open: true,
      severity: input.severity,
      message: input.message,
    });
  }, []);

  const handleClose = useCallback(
    (_event?: unknown, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setToast((prev) => ({ ...prev, open: false }));
    },
    []
  );

  const value = useMemo(() => ({ enqueueToast }), [enqueueToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={AUTO_HIDE_MS}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={handleClose}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
