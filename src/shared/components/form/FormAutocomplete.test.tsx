import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { FormAutocomplete } from './FormAutocomplete';
import { renderWithTheme } from '@/test/renderWithTheme';

describe('FormAutocomplete', () => {
  const options = [
    { value: 'm-1', label: 'MP-006 — AGUA' },
    { value: 'm-2', label: 'MP-002 — ACUCAR' },
  ];

  it('renders label and selected option', () => {
    renderWithTheme(
      <FormAutocomplete
        id="material-field"
        label="Raw material"
        value="m-1"
        onChange={vi.fn()}
        options={options}
      />
    );

    expect(screen.getByRole('combobox', { name: 'Raw material' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('MP-006 — AGUA')).toBeInTheDocument();
  });

  it('filters options by typed name and calls onChange', async () => {
    const onChange = vi.fn();

    renderWithTheme(
      <FormAutocomplete
        id="material-field"
        label="Raw material"
        value=""
        onChange={onChange}
        options={options}
        placeholder="Select a raw material"
      />
    );

    const input = screen.getByRole('combobox', { name: 'Raw material' });
    fireEvent.change(input, { target: { value: 'ACUCAR' } });
    fireEvent.click(await screen.findByRole('option', { name: 'MP-002 — ACUCAR' }));
    expect(onChange).toHaveBeenCalledWith('m-2');
  });

  it('can be disabled', () => {
    renderWithTheme(
      <FormAutocomplete
        id="unit-field"
        label="Unit"
        value="KG"
        onChange={vi.fn()}
        options={[
          { value: 'KG', label: 'Kilogram (kg)' },
          { value: 'LITRO', label: 'Liter (lt)' },
        ]}
        disabled
      />
    );

    expect(screen.getByRole('combobox', { name: 'Unit' })).toBeDisabled();
  });

  it('supports multiple selection', async () => {
    const onChange = vi.fn();

    renderWithTheme(
      <FormAutocomplete
        id="materials-field"
        label="Raw materials"
        multiple
        value={['m-1']}
        onChange={onChange}
        options={options}
      />
    );

    expect(screen.getByText('MP-006 — AGUA')).toBeInTheDocument();
    const input = screen.getByRole('combobox', { name: 'Raw materials' });
    fireEvent.change(input, { target: { value: 'ACUCAR' } });
    fireEvent.click(await screen.findByRole('option', { name: 'MP-002 — ACUCAR' }));
    expect(onChange).toHaveBeenCalledWith(['m-1', 'm-2']);
  });
});
