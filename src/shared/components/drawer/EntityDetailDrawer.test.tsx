import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/renderWithTheme';
import { EntityDetailDrawer } from './EntityDetailDrawer';

describe('EntityDetailDrawer', () => {
  it('renders eyebrow, title, stats, and closes from the X button', () => {
    const onClose = vi.fn();

    renderWithTheme(
      <EntityDetailDrawer
        open
        onClose={onClose}
        eyebrow="Product details"
        title="Calda Base"
        closeAriaLabel="Close details"
        stats={[
          { id: 'cost', label: 'Estimated total cost', value: '$420.50' },
          { id: 'code', label: 'Batch code', value: '#CB-001', compact: true },
        ]}
        onEdit={() => undefined}
        editLabel="Edit"
        onDelete={() => undefined}
        deleteLabel="Delete"
      >
        <div>Body content</div>
      </EntityDetailDrawer>
    );

    expect(screen.getByText('Product details')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Calda Base' })).toBeInTheDocument();
    expect(screen.getByText('$420.50')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
