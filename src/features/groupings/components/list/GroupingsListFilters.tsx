import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import type { GroupingsAppliedFilters } from '@/features/groupings/hooks/useGroupingsFilters';
import type { FormSelectOption } from '@/shared/components/form/FormSelectField';
import {
  FieldBlock,
  FieldLabel,
  FilterSubmitButton,
  FilterTextField,
  FiltersRoot,
  FiltersRow,
} from '@/features/groupings/components/list/GroupingsListFilters.styled';

type GroupingsListFiltersProps = {
  appliedFilters: GroupingsAppliedFilters;
  rawMaterialOptions: FormSelectOption[];
  onApply: (filters: GroupingsAppliedFilters) => void;
};

export function GroupingsListFilters({
  appliedFilters,
  rawMaterialOptions,
  onApply,
}: GroupingsListFiltersProps) {
  const { t } = useTranslation();
  const [draftName, setDraftName] = useState(appliedFilters.name);
  const [draftCode, setDraftCode] = useState(appliedFilters.code);
  const [draftRawMaterialIds, setDraftRawMaterialIds] = useState(
    appliedFilters.rawMaterialIds
  );

  useEffect(() => {
    setDraftName(appliedFilters.name);
    setDraftCode(appliedFilters.code);
    setDraftRawMaterialIds(appliedFilters.rawMaterialIds);
  }, [appliedFilters]);

  const selectedRawMaterials = useMemo(
    () =>
      draftRawMaterialIds.map(
        (id) =>
          rawMaterialOptions.find((option) => option.value === id) ?? {
            value: id,
            label: id,
          }
      ),
    [draftRawMaterialIds, rawMaterialOptions]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onApply({
      name: draftName,
      code: draftCode,
      rawMaterialIds: draftRawMaterialIds,
    });
  };

  return (
    <FiltersRoot>
      <Box component="form" onSubmit={handleSubmit}>
      <FiltersRow>
        <FieldBlock>
          <FieldLabel htmlFor="grouping-filter-name">
            {t('groupings.filters.nameLabel')}
          </FieldLabel>
          <FilterTextField>
            <TextField
              id="grouping-filter-name"
              name="grouping-filter-name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
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
            <Autocomplete
              id="grouping-filter-raw-material"
              multiple
              options={rawMaterialOptions}
              value={selectedRawMaterials}
              onChange={(_event, next) =>
                setDraftRawMaterialIds(next.map((option) => option.value))
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
              noOptionsText={t('groupings.filters.rawMaterialNoOptions')}
              fullWidth
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="grouping-filter-raw-material"
                  placeholder={t('groupings.filters.rawMaterialPlaceholder')}
                  fullWidth
                  size="small"
                  hiddenLabel
                />
              )}
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
              value={draftCode}
              onChange={(e) => setDraftCode(e.target.value)}
              placeholder={t('groupings.filters.codePlaceholder')}
              fullWidth
              size="small"
              hiddenLabel
            />
          </FilterTextField>
        </FieldBlock>
        <FilterSubmitButton variant="contained" disableElevation type="submit">
          {t('groupings.filters.submit')}
        </FilterSubmitButton>
      </FiltersRow>
      </Box>
    </FiltersRoot>
  );
}
