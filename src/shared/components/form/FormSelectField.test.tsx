import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { FormSelectField } from './FormSelectField';
import { renderWithTheme } from '@/test/renderWithTheme';

describe('FormSelectField', () => {
  const options = [
    { value: 'KG', label: 'Kilogram (kg)' },
    { value: 'LITRO', label: 'Liter (lt)' },
  ];

  it('renders label and selected option', () => {
    renderWithTheme(
      <FormSelectField
        id="unit-field"
        label="Unit"
        value="KG"
        onChange={vi.fn()}
        options={options}
      />
    );

    expect(screen.getByRole('combobox', { name: 'Unit' })).toBeInTheDocument();
    expect(screen.getByText('Kilogram (kg)')).toBeInTheDocument();
  });

  it('calls onChange when selecting an option', () => {
    const onChange = vi.fn();

    renderWithTheme(
      <FormSelectField
        id="unit-field"
        label="Unit"
        value="KG"
        onChange={onChange}
        options={options}
      />
    );

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Unit' }));
    fireEvent.click(screen.getByRole('option', { name: 'Liter (lt)' }));
    expect(onChange).toHaveBeenCalledWith('LITRO');
  });

  it('shows empty placeholder option text in the closed select', () => {
    renderWithTheme(
      <FormSelectField
        id="material-field"
        label="Raw material"
        value=""
        onChange={vi.fn()}
        options={[
          { value: '', label: 'Select a raw material' },
          ...options,
        ]}
      />
    );

    expect(screen.getByText('Select a raw material')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Raw material' })).toHaveTextContent(
      'Select a raw material'
    );
  });
});

