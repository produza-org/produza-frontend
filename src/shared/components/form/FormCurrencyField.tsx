import TextField from '@mui/material/TextField';
import { FieldLabel } from '@/shared/components/form/FieldLabel.styled';
import { FieldBlock } from '@/shared/components/form/FormTextField.styled';
import {
  CurrencyFieldRoot,
  CurrencyInputWrapper,
  CurrencyPrefix,
} from '@/shared/components/form/FormCurrencyField.styled';

export type FormCurrencyFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
};

export function FormCurrencyField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
}: FormCurrencyFieldProps) {
  return (
    <FieldBlock>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <CurrencyFieldRoot>
        <CurrencyPrefix aria-hidden>R$</CurrencyPrefix>
        <CurrencyInputWrapper>
          <TextField
            id={id}
            name={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            fullWidth
            variant="standard"
            error={error}
            helperText={helperText}
            disabled={disabled}
            inputProps={{ inputMode: 'decimal' }}
            InputProps={{ disableUnderline: true }}
          />
        </CurrencyInputWrapper>
      </CurrencyFieldRoot>
    </FieldBlock>
  );
}
