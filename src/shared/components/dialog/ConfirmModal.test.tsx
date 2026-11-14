import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';
import { renderWithTheme } from '@/test/renderWithTheme';

describe('ConfirmModal', () => {
  it('renders message and action labels', () => {
    renderWithTheme(
      <ConfirmModal
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete item"
        message="Are you sure?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
      />
    );

    expect(screen.getByText('Delete item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('shows a spinner and disables actions while confirmLoading', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithTheme(
      <ConfirmModal
        open
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        confirmLoading
      />
    );

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const confirm = screen.getByRole('button', { name: 'Confirm' });

    expect(cancel).toBeDisabled();
    expect(confirm).toBeDisabled();
    expect(confirm).toHaveAttribute('aria-busy', 'true');
    expect(confirm.querySelector('.MuiCircularProgress-root')).not.toBeNull();

    fireEvent.click(cancel);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = vi.fn();

    renderWithTheme(
      <ConfirmModal
        open
        onClose={vi.fn()}
        onConfirm={onConfirm}
        message="Are you sure?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
