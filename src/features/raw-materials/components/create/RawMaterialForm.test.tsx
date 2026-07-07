import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { RawMaterialForm } from './RawMaterialForm';
import { renderWithTheme } from '@/test/renderWithTheme';

function renderForm(onSubmit = vi.fn(), onCancel = vi.fn()) {
  return renderWithTheme(
    <I18nextProvider i18n={i18n}>
      <RawMaterialForm onSubmit={onSubmit} onCancel={onCancel} />
    </I18nextProvider>
  );
}

describe('RawMaterialForm', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('renders all form fields', () => {
    renderForm();

    expect(screen.getByLabelText('Raw Material Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Code')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Unit of Measure' })).toBeInTheDocument();
    expect(screen.getByLabelText('Unit Price (BRL)')).toBeInTheDocument();
    expect(screen.getByLabelText('Stock Quantity')).toBeInTheDocument();
  });

  it('formats code input as AAAA-000', () => {
    renderForm();

    const codeInput = screen.getByLabelText('Code');
    fireEvent.change(codeInput, { target: { value: 'stah001' } });

    expect(codeInput).toHaveValue('STAH-001');
  });

  it('submits valid form data', async () => {
    const onSubmit = vi.fn();
    renderForm(onSubmit);

    fireEvent.change(screen.getByLabelText('Raw Material Name'), {
      target: { value: 'Steel Sheet' },
    });
    fireEvent.change(screen.getByLabelText('Code'), { target: { value: 'STAH-001' } });
    fireEvent.change(screen.getByLabelText('Unit Price (BRL)'), { target: { value: '1250' } });
    fireEvent.change(screen.getByLabelText('Stock Quantity'), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Steel Sheet',
        code: 'STAH-001',
        unit: 'KG',
        unitCost: 12.5,
        stockQuantity: 100,
      });
    });
  });

  it('calls onCancel when cancel is clicked', () => {
    const onCancel = vi.fn();
    renderForm(vi.fn(), onCancel);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
