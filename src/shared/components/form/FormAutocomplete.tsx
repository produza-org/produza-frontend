import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FieldLabel } from '@/shared/components/form/FieldLabel.styled';
import { FieldBlock } from '@/shared/components/form/FormTextField.styled';
import { StyledAutocompleteWrapper } from '@/shared/components/form/FormAutocomplete.styled';
import type { FormSelectOption } from '@/shared/components/form/FormSelectField';

type FormAutocompleteBaseProps = {
  id: string;
  label: string;
  options: FormSelectOption[];
  placeholder?: string;
  noOptionsText?: string;
  disabled?: boolean;
  paperMinWidth?: number | string;
};

export type FormAutocompleteProps = FormAutocompleteBaseProps &
  (
    | {
        multiple?: false;
        value: string;
        onChange: (value: string) => void;
      }
    | {
        multiple: true;
        value: string[];
        onChange: (value: string[]) => void;
      }
  );

function resolveSelected(
  options: FormSelectOption[],
  value: string
): FormSelectOption | null {
  return (
    options.find((option) => option.value === value) ??
    (value
      ? {
          value,
          label: value,
        }
      : null)
  );
}

function resolveSelectedMultiple(
  options: FormSelectOption[],
  values: string[]
): FormSelectOption[] {
  return values.map(
    (value) =>
      options.find((option) => option.value === value) ?? {
        value,
        label: value,
      }
  );
}

export function FormAutocomplete(props: FormAutocompleteProps) {
  const {
    id,
    label,
    options,
    placeholder,
    noOptionsText,
    disabled = false,
    paperMinWidth,
  } = props;

  const paperSlotProps =
    paperMinWidth != null
      ? {
          paper: {
            sx: {
              minWidth: paperMinWidth,
            },
          },
        }
      : undefined;

  if (props.multiple) {
    const selected = resolveSelectedMultiple(options, props.value);

    return (
      <FieldBlock>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <StyledAutocompleteWrapper>
          <Autocomplete
            id={id}
            multiple
            options={options}
            value={selected}
            onChange={(_event, next) =>
              props.onChange(next.map((option) => option.value))
            }
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, current) =>
              option.value === current.value
            }
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
            disabled={disabled}
            fullWidth
            slotProps={paperSlotProps}
            renderInput={(params) => (
              <TextField
                {...params}
                name={id}
                placeholder={placeholder}
                variant="standard"
                disabled={disabled}
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

  const selected = resolveSelected(options, props.value);

  return (
    <FieldBlock>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledAutocompleteWrapper>
        <Autocomplete
          id={id}
          options={options}
          value={selected}
          onChange={(_event, option) => props.onChange(option?.value ?? '')}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, current) =>
            option.value === current.value
          }
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
          disabled={disabled}
          fullWidth
          slotProps={paperSlotProps}
          renderInput={(params) => (
            <TextField
              {...params}
              name={id}
              placeholder={placeholder}
              variant="standard"
              disabled={disabled}
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
