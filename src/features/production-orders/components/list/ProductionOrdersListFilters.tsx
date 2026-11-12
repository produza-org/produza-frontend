import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import {
  FieldBlock,
  FieldLabel,
  FilterSubmitButton,
  FilterTextField,
  FiltersRoot,
  FiltersRow,
} from '@/features/production-orders/components/list/ProductionOrdersListFilters.styled';

type ProductionOrdersListFiltersProps = {
  numberFilter: string;
  onNumberFilterChange: (value: string) => void;
};

export function ProductionOrdersListFilters({
  numberFilter,
  onNumberFilterChange,
}: ProductionOrdersListFiltersProps) {
  const { t } = useTranslation();

  return (
    <FiltersRoot>
      <FiltersRow>
        <FieldBlock>
          <FieldLabel htmlFor="production-order-filter-number">
            {t('productionOrders.filters.numberLabel')}
          </FieldLabel>
          <FilterTextField>
            <TextField
              id="production-order-filter-number"
              name="production-order-filter-number"
              value={numberFilter}
              onChange={(e) => onNumberFilterChange(e.target.value)}
              placeholder={t('productionOrders.filters.numberPlaceholder')}
              fullWidth
              size="small"
              hiddenLabel
            />
          </FilterTextField>
        </FieldBlock>
        <FilterSubmitButton variant="contained" disableElevation type="button">
          {t('productionOrders.filters.submit')}
        </FilterSubmitButton>
      </FiltersRow>
    </FiltersRoot>
  );
}
