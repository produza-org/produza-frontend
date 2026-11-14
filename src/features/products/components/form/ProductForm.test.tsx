import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { ProductForm, type ProductFormValues } from './ProductForm';
import { renderWithTheme } from '@/test/renderWithTheme';

function renderForm(
  onSubmit = vi.fn(),
  onCancel = vi.fn(),
  initialValues?: Partial<ProductFormValues>
) {
  return renderWithTheme(
    <I18nextProvider i18n={i18n}>
      <ProductForm onSubmit={onSubmit} onCancel={onCancel} initialValues={initialValues} />
    </I18nextProvider>
  );
}

describe('ProductForm', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('renders all form fields', () => {
    renderForm();

    expect(screen.getByLabelText('Product name')).toBeInTheDocument();
    expect(screen.getByLabelText('Final size')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Final size unit' })).toBeInTheDocument();
    expect(screen.getByLabelText('Yield')).toBeInTheDocument();
    expect(screen.getByLabelText('Expansion factor')).toBeInTheDocument();
  });

  it('recalculates expansion factor when yield changes', () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Yield'), { target: { value: '0.75' } });

    expect(screen.getByLabelText('Expansion factor')).toHaveValue('1,333333');
  });

  it('submits valid form data without expansionFactor', async () => {
    const onSubmit = vi.fn();
    renderForm(onSubmit);

    fireEvent.change(screen.getByLabelText('Product name'), {
      target: { value: 'POTE 1,5L COCO BRANCO' },
    });
    fireEvent.change(screen.getByLabelText('Final size'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByLabelText('Yield'), { target: { value: '0.75' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'POTE 1,5L COCO BRANCO',
        finalSize: 1.5,
        finalSizeUnit: 'L',
        yield: 0.75,
      });
    });
  });

  it('calls onCancel when cancel is clicked', () => {
    const onCancel = vi.fn();
    renderForm(vi.fn(), onCancel);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('prefills fields from initialValues', () => {
    renderForm(vi.fn(), vi.fn(), {
      name: 'POTE 1,5L COCO BRANCO',
      finalSizeDisplay: '1.5',
      finalSizeUnit: 'L',
      yieldDisplay: '0.75',
    });

    expect(screen.getByLabelText('Product name')).toHaveValue('POTE 1,5L COCO BRANCO');
    expect(screen.getByLabelText('Final size')).toHaveValue('1.5');
    expect(screen.getByLabelText('Yield')).toHaveValue('0.75');
    expect(screen.getByLabelText('Expansion factor')).toHaveValue('1,333333');
  });

  it('keeps Next disabled in step mode until general info is valid', async () => {
    const onSubmit = vi.fn();
    renderWithTheme(
      <I18nextProvider i18n={i18n}>
        <ProductForm mode="step" onSubmit={onSubmit} onCancel={vi.fn()} />
      </I18nextProvider>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Product name'), {
      target: { value: 'POTE 1,5L COCO BRANCO' },
    });
    expect(nextButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Final size'), { target: { value: '1.5' } });
    expect(nextButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Yield'), { target: { value: '0.75' } });
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'POTE 1,5L COCO BRANCO',
        finalSize: 1.5,
        finalSizeUnit: 'L',
        yield: 0.75,
      });
    });
  });
});
