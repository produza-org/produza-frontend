import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { FormTextField } from './FormTextField';
import { renderWithTheme } from '@/test/renderWithTheme';

describe('FormTextField', () => {
  it('renders label and placeholder', () => {
    renderWithTheme(
      <FormTextField
        id="test-field"
        label="Test Label"
        placeholder="Test placeholder"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();

    renderWithTheme(
      <FormTextField
        id="test-field"
        label="Test Label"
        value=""
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Test Label'), { target: { value: 'A' } });
    expect(onChange).toHaveBeenCalledWith('A');
  });
});
