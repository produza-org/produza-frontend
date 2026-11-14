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

  it('auto-hides the toast after the duration', async () => {
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
