import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import {
  CodeFieldBlock,
  FieldBlock,
  FieldLabel,
  FilterSubmitButton,
  FilterTextField,
  FiltersRoot,
  FiltersRow,
} from '@/features/raw-materials/components/RawMaterialsListFilters.styled';

type RawMaterialsListFiltersProps = {
  nameFilter: string;
  codeFilter: string;
  onNameFilterChange: (value: string) => void;
  onCodeFilterChange: (value: string) => void;
};

export function RawMaterialsListFilters({
  nameFilter,
  codeFilter,
  onNameFilterChange,
  onCodeFilterChange,
}: RawMaterialsListFiltersProps) {
  const { t } = useTranslation();

  return (
    <FiltersRoot>
      <FiltersRow>
        <FieldBlock>
          <FieldLabel htmlFor="raw-material-filter-name">
            {t('rawMaterials.filters.nameLabel')}
          </FieldLabel>
          <FilterTextField>
            <TextField
              id="raw-material-filter-name"
              name="raw-material-filter-name"
              value={nameFilter}
              onChange={(e) => onNameFilterChange(e.target.value)}
              placeholder={t('rawMaterials.filters.namePlaceholder')}
              fullWidth
              size="small"
              hiddenLabel
            />
          </FilterTextField>
        </FieldBlock>
        <CodeFieldBlock>
          <FieldLabel htmlFor="raw-material-filter-code">
            {t('rawMaterials.filters.codeLabel')}
          </FieldLabel>
          <FilterTextField>
            <TextField
              id="raw-material-filter-code"
              name="raw-material-filter-code"
              value={codeFilter}
              onChange={(e) => onCodeFilterChange(e.target.value)}
              placeholder={t('rawMaterials.filters.codePlaceholder')}
              fullWidth
              size="small"
              hiddenLabel
            />
          </FilterTextField>
        </CodeFieldBlock>
        <FilterSubmitButton variant="contained" disableElevation type="button">
          {t('rawMaterials.filters.submit')}
        </FilterSubmitButton>
      </FiltersRow>
    </FiltersRoot>
  );
}
