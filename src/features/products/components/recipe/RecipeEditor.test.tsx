import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { renderWithTheme } from '@/test/renderWithTheme';
import type { Product } from '@/features/products/types/product';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { RecipeEditor } from './RecipeEditor';

const product: Product = {
  id: 'p-1',
  name: 'POTE 1,5L COCO BRANCO',
  finalSize: 1.5,
  finalSizeUnit: 'L',
  yield: 0.75,
  expansionFactor: 1.3333333333333333,
  status: 'active',
};

const materials: RawMaterial[] = [
  {
    id: 'm-1',
    code: 'MP-006',
    name: 'AGUA',
    status: 'active',
    stockQuantity: 10,
    minStock: 1,
    unit: 'LITRO',
    unitCost: 1,
    totalCost: 10,
  },
  {
    id: 'm-2',
    code: 'MP-002',
    name: 'ACUCAR',
    status: 'active',
    stockQuantity: 10,
    minStock: 1,
    unit: 'KG',
    unitCost: 1,
    totalCost: 10,
  },
  {
    id: 'm-3',
    code: 'MP-EMB-POTE',
    name: 'POTE 1,5L',
    status: 'active',
    stockQuantity: 10,
    minStock: 1,
    unit: 'UNID',
    unitCost: 1,
    totalCost: 10,
  },
];

async function selectMaterial(index: number, optionLabel: string) {
  const materialInputs = screen.getAllByRole('combobox', { name: 'Raw material' });
  fireEvent.change(materialInputs[index], { target: { value: optionLabel } });
  fireEvent.click(await screen.findByRole('option', { name: optionLabel }));
}

function renderEditor(onSubmit = vi.fn()) {
  return renderWithTheme(
    <I18nextProvider i18n={i18n}>
      <RecipeEditor
        product={product}
        recipe={null}
        materials={materials}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    </I18nextProvider>
  );
}

describe('RecipeEditor', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('keeps save disabled when raw-material proportion sum is not 1', () => {
    renderEditor();

    fireEvent.click(screen.getAllByRole('button', { name: 'Add line' })[0]);
    fireEvent.change(screen.getByLabelText('Proportion'), {
      target: { value: '0.4' },
    });

    expect(screen.getByRole('button', { name: 'Save recipe' })).toBeDisabled();
    expect(screen.getByText(/Σ =/)).toBeInTheDocument();
    expect(screen.queryByText(/Must equal 1/i)).not.toBeInTheDocument();
  });

  it('shows raw material, component, and packaging blocks', () => {
    renderEditor();

    expect(screen.getByText('Raw material')).toBeInTheDocument();
    expect(screen.getByText('Component')).toBeInTheDocument();
    expect(screen.getByText('Packaging')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Add line' })).toHaveLength(3);
  });

  it('strips empty rows and keeps optional component/packaging out of the required sum', async () => {
    const onSubmit = vi.fn();
    renderEditor(onSubmit);

    const addButtons = screen.getAllByRole('button', { name: 'Add line' });
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[1]);
    fireEvent.click(addButtons[2]);

    await selectMaterial(0, 'MP-006 — AGUA');
    await selectMaterial(1, 'MP-002 — ACUCAR');

    const proportions = screen.getAllByLabelText('Proportion');
    fireEvent.change(proportions[0], { target: { value: '0.4' } });
    fireEvent.change(proportions[1], { target: { value: '0.6' } });

    const saveButton = screen.getByRole('button', { name: 'Save recipe' });
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        lines: [
          {
            rawMaterialId: 'm-1',
            category: 'MATERIA_PRIMA',
            proportion: 0.4,
            sortOrder: 0,
          },
          {
            rawMaterialId: 'm-2',
            category: 'MATERIA_PRIMA',
            proportion: 0.6,
            sortOrder: 1,
          },
        ],
      });
    });
  });

  it('includes optional component and packaging lines in the PUT payload', async () => {
    const onSubmit = vi.fn();
    renderEditor(onSubmit);

    const addButtons = screen.getAllByRole('button', { name: 'Add line' });
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[1]);
    fireEvent.click(addButtons[2]);

    await selectMaterial(0, 'MP-006 — AGUA');
    await selectMaterial(1, 'MP-002 — ACUCAR');
    await selectMaterial(2, 'MP-EMB-POTE — POTE 1,5L');

    const proportions = screen.getAllByLabelText('Proportion');
    fireEvent.change(proportions[0], { target: { value: '1' } });
    fireEvent.change(proportions[1], { target: { value: '0.5' } });
    fireEvent.change(proportions[2], { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save recipe' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        lines: [
          {
            rawMaterialId: 'm-1',
            category: 'MATERIA_PRIMA',
            proportion: 1,
            sortOrder: 0,
          },
          {
            rawMaterialId: 'm-2',
            category: 'COMPONENTE',
            proportion: 0.5,
            sortOrder: 1,
          },
          {
            rawMaterialId: 'm-3',
            category: 'EMBALAGEM',
            proportion: 1,
            sortOrder: 2,
          },
        ],
      });
    });
  });

  it('lets the user change unit via searchable select after picking a material', async () => {
    renderEditor();

    fireEvent.click(screen.getAllByRole('button', { name: 'Add line' })[0]);

    const unitInput = screen.getByRole('combobox', { name: 'Unit' });
    expect(unitInput).toBeDisabled();

    await selectMaterial(0, 'MP-006 — AGUA');

    expect(unitInput).toBeEnabled();
    expect(unitInput).toHaveDisplayValue('Liter (lt)');

    fireEvent.change(unitInput, { target: { value: 'Kilogram' } });
    fireEvent.click(await screen.findByRole('option', { name: 'Kilogram (kg)' }));

    expect(unitInput).toHaveDisplayValue('Kilogram (kg)');
  });
});
