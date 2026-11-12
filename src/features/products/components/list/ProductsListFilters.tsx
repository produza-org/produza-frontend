import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import {
  FieldBlock,
  FieldLabel,
  FilterSubmitButton,
  FilterTextField,
  FiltersRoot,
  FiltersRow,
} from '@/features/products/components/list/ProductsListFilters.styled';

type ProductsListFiltersProps = {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
};

export function ProductsListFilters({
  nameFilter,
  onNameFilterChange,
}: ProductsListFiltersProps) {
  const { t } = useTranslation();

  return (
    <FiltersRoot>
      <FiltersRow>
        <FieldBlock>
          <FieldLabel htmlFor="product-filter-name">
            {t('products.filters.nameLabel')}
          </FieldLabel>
          <FilterTextField>
            <TextField
              id="product-filter-name"
              name="product-filter-name"
              value={nameFilter}
              onChange={(e) => onNameFilterChange(e.target.value)}
              placeholder={t('products.filters.namePlaceholder')}
              fullWidth
              size="small"
              hiddenLabel
            />
          </FilterTextField>
        </FieldBlock>
        <FilterSubmitButton variant="contained" disableElevation type="button">
          {t('products.filters.submit')}
        </FilterSubmitButton>
      </FiltersRow>
    </FiltersRoot>
  );
}
