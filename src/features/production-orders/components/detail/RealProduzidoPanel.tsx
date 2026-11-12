import { useEffect, useState } from 'react';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useTranslation } from 'react-i18next';
import { FormTextField } from '@/shared/components/form';
import {
  formatDecimal,
  parseDecimalInput,
  sanitizeDecimalInput,
} from '@/features/production-orders/utils/format';
import { getRealVariation } from '@/features/production-orders/utils/variation';
import { ActionButton } from '@/features/production-orders/components/detail/ProductionOrderDetail.styled';
import {
  FloorSection,
  FloorSectionHeader,
  FloorSectionTitle,
  RealControls,
  VariationBadge,
} from '@/features/production-orders/components/detail/FloorStepsPanel.styled';

type RealProduzidoPanelProps = {
  realProduzido: number;
  qtdAProduzir: number;
  isMutating?: boolean;
  onSave: (realProduzido: number) => void | Promise<void>;
};

export function RealProduzidoPanel({
  realProduzido,
  qtdAProduzir,
  isMutating = false,
  onSave,
}: RealProduzidoPanelProps) {
  const { t } = useTranslation();
  const [display, setDisplay] = useState(String(realProduzido));

  useEffect(() => {
    setDisplay(String(realProduzido));
  }, [realProduzido]);

  const parsed = parseDecimalInput(display);
  const canSave =
    Number.isFinite(parsed) && parsed >= 0 && !isMutating && parsed !== realProduzido;
  const variation = getRealVariation(
    Number.isFinite(parsed) ? parsed : realProduzido,
    qtdAProduzir
  );
  const tone =
    variation > 0 ? 'positive' : variation < 0 ? 'negative' : 'neutral';
  const signedVariation =
    variation > 0
      ? `+${formatDecimal(variation, 6)}`
      : formatDecimal(variation, 6);

  return (
    <FloorSection>
      <FloorSectionHeader>
        <FloorSectionTitle>
          {t('productionOrders.detail.real.title')}
        </FloorSectionTitle>
      </FloorSectionHeader>

      <RealControls>
        <FormTextField
          id="production-order-real-produzido"
          label={t('productionOrders.detail.real.label')}
          placeholder={t('productionOrders.detail.real.placeholder')}
          value={display}
          onChange={(value) => setDisplay(sanitizeDecimalInput(value))}
          inputMode="decimal"
          disabled={isMutating}
        />
        <ActionButton
          type="button"
          variant="contained"
          disableElevation
          startIcon={<SaveOutlined />}
          disabled={!canSave}
          onClick={() => {
            void onSave(parsed);
          }}
        >
          {isMutating
            ? t('productionOrders.detail.real.saving')
            : t('productionOrders.detail.real.save')}
        </ActionButton>
        <VariationBadge $tone={tone}>
          {t('productionOrders.detail.real.variation', {
            value: signedVariation,
          })}
        </VariationBadge>
      </RealControls>
    </FloorSection>
  );
}
