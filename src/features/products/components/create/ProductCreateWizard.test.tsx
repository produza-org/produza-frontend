import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { renderWithTheme } from '@/test/renderWithTheme';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';
import { ProductCreateWizard } from './ProductCreateWizard';

vi.mock('@/features/groupings/api', () => ({
  listAllRawMaterialGroups: vi.fn().mockResolvedValue([]),
}));

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
];

function renderWizard(onSave = vi.fn()) {
  return renderWithTheme(
    <I18nextProvider i18n={i18n}>
      <ProductCreateWizard
        materials={materials}
        onCancel={vi.fn()}
        onSave={onSave}
      />
    </I18nextProvider>
  );
}

async function goToRecipeStep() {
  fireEvent.change(screen.getByLabelText('Product name'), {
    target: { value: 'POTE 1,5L COCO BRANCO' },
  });
  fireEvent.change(screen.getByLabelText('Final size'), { target: { value: '1.5' } });
  fireEvent.change(screen.getByLabelText('Yield'), { target: { value: '0.75' } });
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  await screen.findByText(/Add raw materials until/);
}

async function selectMaterial(index: number, optionLabel: string) {
  const materialInputs = screen.getAllByRole('combobox', { name: 'Raw material' });
  fireEvent.change(materialInputs[index], { target: { value: optionLabel } });
  fireEvent.click(await screen.findByRole('option', { name: optionLabel }));
}

describe('ProductCreateWizard', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('keeps Next disabled until step 1 is valid', () => {
    renderWizard();

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Product name'), {
      target: { value: 'POTE' },
    });
    fireEvent.change(screen.getByLabelText('Final size'), { target: { value: '1.5' } });
    expect(nextButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Yield'), { target: { value: '0.75' } });
    expect(nextButton).toBeEnabled();
  });

  it('keeps final Save disabled until a complete raw-material line exists', async () => {
    renderWizard();
    await goToRecipeStep();

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();

    fireEvent.click(screen.getAllByRole('button', { name: 'Add line' })[0]);
    fireEvent.change(screen.getByLabelText('Proportion'), {
      target: { value: '0.4' },
    });
    expect(saveButton).toBeDisabled();

    await selectMaterial(0, 'MP-006 — AGUA');
    expect(saveButton).toBeEnabled();
  });

  it('shows optional component and packaging sections on step 2', async () => {
    renderWizard();
    await goToRecipeStep();

    expect(screen.getByText('Raw material')).toBeInTheDocument();
    expect(screen.getByText('Component')).toBeInTheDocument();
    expect(screen.getByText('Packaging')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Add line' })).toHaveLength(3);
    expect(screen.queryByText(/Must equal 1/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Add line' })[0]);
    fireEvent.change(screen.getByLabelText('Proportion'), {
      target: { value: '0.4' },
    });

    expect(screen.getByText('Raw material proportion sum')).toBeInTheDocument();
    expect(screen.getByText(/^Σ =/)).toBeInTheDocument();
    expect(screen.queryByText(/Must equal 1/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText((_, node) => node?.textContent === ' · Valid')
    ).not.toBeInTheDocument();
  });

  it('calls onSave with general values and recipe lines when valid', async () => {
    const onSave = vi.fn();
    renderWizard(onSave);
    await goToRecipeStep();

    const addButtons = screen.getAllByRole('button', { name: 'Add line' });
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);

    await selectMaterial(0, 'MP-006 — AGUA');
    await selectMaterial(1, 'MP-002 — ACUCAR');

    const proportions = screen.getAllByLabelText('Proportion');
    fireEvent.change(proportions[0], { target: { value: '0.4' } });
    fireEvent.change(proportions[1], { target: { value: '0.6' } });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        general: {
          name: 'POTE 1,5L COCO BRANCO',
          finalSize: 1.5,
          finalSizeUnit: 'L',
          yield: 0.75,
        },
        recipe: {
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
          groups: [],
        },
      });
    });
  });
});
