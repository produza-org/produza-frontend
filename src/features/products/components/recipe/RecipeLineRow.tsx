import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';
import { FormAutocomplete, FormTextField } from '@/shared/components/form';
import { RAW_MATERIAL_UNIT_OPTIONS } from '@/features/raw-materials/constants';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import type { RecipeDraftLine } from '@/features/products/utils/recipe/draft-lines';
import { sanitizeDecimalInput } from '@/features/products/utils/format';
import {
  LineRowRoot,
  RemoveLineButton,
} from '@/features/products/components/recipe/RecipeEditor.styled';

type RecipeLineRowProps = {
  line: RecipeDraftLine;
  materials: RawMaterial[];
  usedMaterialIds: Set<string>;
  onChange: (line: RecipeDraftLine) => void;
  onRemove: () => void;
};

export function RecipeLineRow({
  line,
  materials,
  usedMaterialIds,
  onChange,
  onRemove,
}: RecipeLineRowProps) {
  const { t } = useTranslation();

  const options = materials
    .filter(
      (material) =>
        material.status === 'active' &&
        (material.id === line.rawMaterialId || !usedMaterialIds.has(material.id))
    )
    .map((material) => ({
      value: material.id,
      label: `${material.code} — ${material.name}`,
    }));

  const materialOptions =
    line.rawMaterialId && !options.some((option) => option.value === line.rawMaterialId)
      ? [
          {
            value: line.rawMaterialId,
            label: t('products.recipe.materialUnavailable'),
          },
          ...options,
        ]
      : options;

  const knownUnitOptions = RAW_MATERIAL_UNIT_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));

  const unitOptions =
    line.unit && !knownUnitOptions.some((option) => option.value === line.unit)
      ? [{ value: line.unit, label: line.unit }, ...knownUnitOptions]
      : knownUnitOptions;

  return (
    <LineRowRoot>
      <FormAutocomplete
        id={`recipe-material-${line.key}`}
        label={t('products.recipe.materialLabel')}
        value={line.rawMaterialId}
        onChange={(value) => {
          const selected = materials.find((material) => material.id === value);
          onChange({
            ...line,
            rawMaterialId: value,
            unit: selected?.unit ?? '',
          });
        }}
        options={materialOptions}
        placeholder={t('products.recipe.materialPlaceholder')}
        noOptionsText={t('products.recipe.materialNoOptions')}
      />
      <FormTextField
        id={`recipe-proportion-${line.key}`}
        label={t('products.recipe.proportionLabel')}
        placeholder={t('products.recipe.proportionPlaceholder')}
        value={line.proportionDisplay}
        onChange={(value) =>
          onChange({
            ...line,
            proportionDisplay: sanitizeDecimalInput(value),
          })
        }
        inputMode="decimal"
      />
      <FormAutocomplete
        id={`recipe-unit-${line.key}`}
        label={t('products.recipe.unitLabel')}
        value={line.unit}
        onChange={(value) =>
          onChange({
            ...line,
            unit: value,
          })
        }
        options={unitOptions}
        placeholder={t('products.recipe.unitPlaceholder')}
        noOptionsText={t('products.recipe.unitNoOptions')}
        disabled={!line.rawMaterialId}
        paperMinWidth="max(100%, 12rem)"
      />
      <RemoveLineButton
        type="button"
        aria-label={t('products.recipe.removeLine')}
        onClick={onRemove}
      >
        <DeleteOutline fontSize="small" />
      </RemoveLineButton>
    </LineRowRoot>
  );
}
