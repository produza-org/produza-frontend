import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import Button from '@mui/material/Button';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';
import { renderWithTheme } from '@/test/renderWithTheme';

function ToastProbe() {
  const { enqueueToast } = useToast();
  return (
    <Button
      type="button"
      onClick={() =>
        enqueueToast({ severity: 'success', message: 'Saved successfully' })
      }
    >
      Show toast
    </Button>
  );
}

describe('ToastProvider', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a toast when enqueueToast is called', () => {
    renderWithTheme(
      <ToastProvider>
        <ToastProbe />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show toast' }));

    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('replaces the active toast when a new one is enqueued', () => {
    function MultiToastProbe() {
      const { enqueueToast } = useToast();
      return (
        <>
          <Button
            type="button"
            onClick={() =>
              enqueueToast({ severity: 'success', message: 'First toast' })
            }
          >
            First
          </Button>
          <Button
            type="button"
            onClick={() =>
              enqueueToast({ severity: 'error', message: 'Second toast' })
            }
          >
            Second
          </Button>
        </>
      );
    }

    renderWithTheme(
      <ToastProvider>
        <MultiToastProbe />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    expect(screen.getByText('First toast')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Second' }));
    expect(screen.getByText('Second toast')).toBeInTheDocument();
    expect(screen.queryByText('First toast')).not.toBeInTheDocument();
  });

  it('auto-hides success toasts after 4 seconds', async () => {
    vi.useFakeTimers();

    renderWithTheme(
      <ToastProvider>
        <ToastProbe />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show toast' }));
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(4000);
    });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument();
  });

  it('auto-hides error toasts after 7 seconds by default', async () => {
    vi.useFakeTimers();

    function ErrorToastProbe() {
      const { enqueueToast } = useToast();
      return (
        <Button
          type="button"
          onClick={() =>
            enqueueToast({ severity: 'error', message: 'Request failed' })
          }
        >
          Show error
        </Button>
      );
    }

    renderWithTheme(
      <ToastProvider>
        <ErrorToastProbe />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show error' }));
    expect(screen.getByText('Request failed')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(6999);
    });
    expect(screen.getByText('Request failed')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByText('Request failed')).not.toBeInTheDocument();
  });

  it('respects a custom autoHideDuration', async () => {
    vi.useFakeTimers();

    function CustomToastProbe() {
      const { enqueueToast } = useToast();
      return (
        <Button
          type="button"
          onClick={() =>
            enqueueToast({
              severity: 'error',
              message: 'Custom duration',
              autoHideDuration: 1000,
            })
          }
        >
          Show custom
        </Button>
      );
    }

    renderWithTheme(
      <ToastProvider>
        <CustomToastProbe />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show custom' }));
    expect(screen.getByText('Custom duration')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByText('Custom duration')).not.toBeInTheDocument();
  });

  it('closes when the alert close control is clicked', async () => {
    renderWithTheme(
      <ToastProvider>
        <ToastProbe />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show toast' }));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument();
    });
  });
});
