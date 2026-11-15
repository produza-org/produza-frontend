import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/renderWithTheme';
import { EntityDetailDrawer } from './EntityDetailDrawer';

describe('EntityDetailDrawer', () => {
  it('renders title and closes from the X button', () => {
    const onClose = vi.fn();

    renderWithTheme(
      <EntityDetailDrawer
        open
        onClose={onClose}
        title="Sample entity"
        subtitle="Overview"
        closeAriaLabel="Close details"
      >
        <div>Body content</div>
      </EntityDetailDrawer>
    );

    expect(screen.getByRole('heading', { name: 'Sample entity' })).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
