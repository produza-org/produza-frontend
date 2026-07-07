import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { FormCurrencyField } from './FormCurrencyField';
import { renderWithTheme } from '@/test/renderWithTheme';

describe('FormCurrencyField', () => {
  it('renders label, currency prefix and value', () => {
    renderWithTheme(
      <FormCurrencyField
        id="price-field"
        label="Unit Price"
        placeholder="0,00"
        value="10,50"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Unit Price')).toBeInTheDocument();
    expect(screen.getByText('R$')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10,50')).toBeInTheDocument();
  });
});
