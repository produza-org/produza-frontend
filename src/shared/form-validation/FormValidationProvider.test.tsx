import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import Button from '@mui/material/Button';
import { FormValidationProvider } from '@/shared/form-validation/FormValidationProvider';
import { useFormValidation } from '@/shared/form-validation/useFormValidation';
import { renderWithTheme } from '@/test/renderWithTheme';

function Probe() {
  const { errors, submitWithValidation, clearField, getError } =
    useFormValidation();
  return (
    <div>
      <input id="name" />
      <span data-testid="name-error">{getError('name') ?? ''}</span>
      <span data-testid="error-count">{Object.keys(errors).length}</span>
      <Button
        type="button"
        onClick={() =>
          submitWithValidation(
            () => ({ name: 'Required' }),
            () => undefined,
            ['name']
          )
        }
      >
        Fail
      </Button>
      <Button
        type="button"
        onClick={() =>
          submitWithValidation(() => ({}), () => undefined, ['name'])
        }
      >
        Pass
      </Button>
      <Button type="button" onClick={() => clearField('name')}>
        Clear
      </Button>
    </div>
  );
}

describe('FormValidationProvider', () => {
  it('sets errors and clears a field', () => {
    const onValid = vi.fn();
    function ProbeWithValid() {
      const { submitWithValidation, getError } = useFormValidation();
      return (
        <div>
          <input id="name" />
          <span data-testid="name-error">{getError('name') ?? ''}</span>
          <Button
            type="button"
            onClick={() =>
              submitWithValidation(() => ({}), onValid, ['name'])
            }
          >
            Pass
          </Button>
        </div>
      );
    }

    renderWithTheme(
      <FormValidationProvider>
        <Probe />
        <ProbeWithValid />
      </FormValidationProvider>
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Fail' })[0]);
    expect(screen.getAllByTestId('name-error')[0]).toHaveTextContent('Required');

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getAllByTestId('name-error')[0]).toHaveTextContent('');
  });

  it('calls onValid when validation passes', () => {
    const onValid = vi.fn();
    function PassProbe() {
      const { submitWithValidation } = useFormValidation();
      return (
        <Button
          type="button"
          onClick={() => submitWithValidation(() => ({}), onValid)}
        >
          Pass
        </Button>
      );
    }

    renderWithTheme(
      <FormValidationProvider>
        <PassProbe />
      </FormValidationProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pass' }));
    expect(onValid).toHaveBeenCalledTimes(1);
  });
});
