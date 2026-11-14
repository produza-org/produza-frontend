import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FieldLabel } from '@/shared/components/form/FieldLabel.styled';
import { FieldBlock } from '@/shared/components/form/FormTextField.styled';
import { StyledAutocompleteWrapper } from '@/shared/components/form/FormAutocomplete.styled';
import type { FormSelectOption } from '@/shared/components/form/FormSelectField';

export type FormAutocompleteProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  noOptionsText?: string;
};

export function FormAutocomplete({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  noOptionsText,
}: FormAutocompleteProps) {
  const selected =
    options.find((option) => option.value === value) ??
    (value
      ? {
          value,
          label: value,
        }
      : null);

  return (
    <FieldBlock>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledAutocompleteWrapper>
        <Autocomplete
          id={id}
          options={options}
          value={selected}
          onChange={(_event, option) => onChange(option?.value ?? '')}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, current) => option.value === current.value}
          filterOptions={(available, state) => {
            const query = state.inputValue.trim().toLowerCase();
            if (!query) {
              return available;
            }
            return available.filter((option) =>
              option.label.toLowerCase().includes(query)
            );
          }}
          noOptionsText={noOptionsText}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              name={id}
              placeholder={placeholder}
              variant="standard"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
            />
          )}
        />
      </StyledAutocompleteWrapper>
    </FieldBlock>
  );
}
