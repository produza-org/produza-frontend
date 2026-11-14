import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FieldLabel } from '@/shared/components/form/FieldLabel.styled';
import { FieldBlock } from '@/shared/components/form/FormTextField.styled';
import { StyledSelectWrapper } from '@/shared/components/form/FormSelectField.styled';

export type FormSelectOption = {
  value: string;
  label: string;
};

export type FormSelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
};

export function FormSelectField({
  id,
  label,
  value,
  onChange,
  options,
}: FormSelectFieldProps) {
  const labelId = `${id}-label`;

  return (
    <FieldBlock>
      <FieldLabel id={labelId} htmlFor={id}>
        {label}
      </FieldLabel>
      <StyledSelectWrapper>
        <Select
          id={id}
          name={id}
          labelId={labelId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          variant="standard"
          disableUnderline
          displayEmpty
          MenuProps={{
            PaperProps: {
              sx: (theme) => ({
                backgroundColor: theme.palette.produza.surfaceContainerLowest,
                color: theme.palette.produza.onSurface,
                '& .MuiMenuItem-root': {
                  color: theme.palette.produza.onSurface,
                },
                '& .MuiMenuItem-root.Mui-selected': {
                  backgroundColor: `${theme.palette.produza.primary}14`,
                  color: theme.palette.produza.onSurface,
                },
              }),
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value || '__empty'} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </StyledSelectWrapper>
    </FieldBlock>
  );
}
