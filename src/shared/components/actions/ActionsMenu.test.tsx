import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { ActionsMenu, type ActionsMenuItem } from './ActionsMenu';
import { renderWithTheme } from '@/test/renderWithTheme';

function renderMenu(items?: ActionsMenuItem[]) {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const defaultItems: ActionsMenuItem[] = items ?? [
    {
      id: 'edit',
      label: 'Edit',
      icon: <EditOutlined fontSize="small" />,
      onClick: onEdit,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <DeleteOutline fontSize="small" />,
      onClick: onDelete,
      tone: 'danger',
    },
  ];

  renderWithTheme(<ActionsMenu ariaLabel="Row actions" items={defaultItems} />);
  return { onEdit, onDelete };
}

describe('ActionsMenu', () => {
  it('renders trigger with aria-label', () => {
    renderMenu();
    expect(screen.getByRole('button', { name: 'Row actions' })).toBeInTheDocument();
  });

  it('does not open on mouse enter', () => {
    renderMenu();
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Row actions' }));

    expect(screen.queryByRole('menuitem', { name: /Edit/i })).not.toBeInTheDocument();
  });

  it('opens on click and shows item labels', async () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Row actions' }));

    expect(await screen.findByRole('menuitem', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Delete/i })).toBeInTheDocument();
  });

  it('calls item onClick and closes the menu', async () => {
    const { onEdit } = renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Row actions' }));

    const editItem = await screen.findByRole('menuitem', { name: /Edit/i });
    fireEvent.click(editItem);

    expect(onEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: /Edit/i })).not.toBeInTheDocument();
    });
  });

  it('renders danger tone item for delete action', async () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Row actions' }));

    const deleteItem = await screen.findByRole('menuitem', { name: /Delete/i });
    expect(deleteItem).toBeInTheDocument();
    expect(deleteItem).toHaveTextContent('Delete');
  });
});
