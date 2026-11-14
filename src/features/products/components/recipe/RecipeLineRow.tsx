import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';
import { FormAutocomplete, FormTextField } from '@/shared/components/form';
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
      <FormTextField
        id={`recipe-unit-${line.key}`}
        label={t('products.recipe.unitLabel')}
        value={line.unit || '—'}
        onChange={() => undefined}
        disabled
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
