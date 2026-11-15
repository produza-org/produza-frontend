import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import {
  FieldBlock,
  FieldLabel,
  FilterSubmitButton,
  FilterTextField,
  FiltersRoot,
  FiltersRow,
} from '@/features/groupings/components/list/GroupingsListFilters.styled';

type GroupingsListFiltersProps = {
  nameFilter: string;
  codeFilter: string;
  rawMaterialFilter: string;
  onNameFilterChange: (value: string) => void;
  onCodeFilterChange: (value: string) => void;
  onRawMaterialFilterChange: (value: string) => void;
};

export function GroupingsListFilters({
  nameFilter,
  codeFilter,
  rawMaterialFilter,
  onNameFilterChange,
  onCodeFilterChange,
  onRawMaterialFilterChange,
}: GroupingsListFiltersProps) {
  const { t } = useTranslation();

  return (
    <FiltersRoot>
      <FiltersRow>
        <FieldBlock>
          <FieldLabel htmlFor="grouping-filter-name">
            {t('groupings.filters.nameLabel')}
          </FieldLabel>
          <FilterTextField>
            <TextField
              id="grouping-filter-name"
              name="grouping-filter-name"
              value={nameFilter}
              onChange={(e) => onNameFilterChange(e.target.value)}
              placeholder={t('groupings.filters.namePlaceholder')}
              fullWidth
              size="small"
              hiddenLabel
            />
          </FilterTextField>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel htmlFor="grouping-filter-raw-material">
            {t('groupings.filters.rawMaterialLabel')}
          </FieldLabel>
          <FilterTextField>
            <TextField
              id="grouping-filter-raw-material"
              name="grouping-filter-raw-material"
              value={rawMaterialFilter}
              onChange={(e) => onRawMaterialFilterChange(e.target.value)}
              placeholder={t('groupings.filters.rawMaterialPlaceholder')}
              fullWidth
              size="small"
              hiddenLabel
            />
          </FilterTextField>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel htmlFor="grouping-filter-code">
            {t('groupings.filters.codeLabel')}
          </FieldLabel>
          <FilterTextField>
            <TextField
              id="grouping-filter-code"
              name="grouping-filter-code"
              value={codeFilter}
              onChange={(e) => onCodeFilterChange(e.target.value)}
              placeholder={t('groupings.filters.codePlaceholder')}
              fullWidth
              size="small"
              hiddenLabel
            />
          </FilterTextField>
        </FieldBlock>
        <FilterSubmitButton variant="contained" disableElevation type="button">
          {t('groupings.filters.submit')}
        </FilterSubmitButton>
      </FiltersRow>
    </FiltersRoot>
  );
}
