import TextField from '@mui/material/TextField';
import { FieldLabel } from '@/shared/components/form/FieldLabel.styled';
import {
  FieldBlock,
  StyledTextFieldWrapper,
} from '@/shared/components/form/FormTextField.styled';

export type FormTextFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'password' | 'email';
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
};

export function FormTextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  inputMode,
  autoComplete,
  error = false,
  helperText,
  disabled = false,
}: FormTextFieldProps) {
  return (
    <FieldBlock>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledTextFieldWrapper>
        <TextField
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          fullWidth
          variant="standard"
          type={type}
          error={error}
          helperText={helperText}
          disabled={disabled}
          inputProps={{ inputMode, autoComplete }}
          InputProps={{ disableUnderline: true }}
        />
      </StyledTextFieldWrapper>
    </FieldBlock>
  );
}
