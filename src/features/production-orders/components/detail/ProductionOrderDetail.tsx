import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import Alert from '@mui/material/Alert';
import { FormTextField } from '@/shared/components/form';
import type {
  ProductionOrder,
  ProductionStepInput,
} from '@/features/production-orders/types/production-order';
import {
  formatDateDisplay,
  formatDecimal,
  parseDecimalInput,
  sanitizeDecimalInput,
} from '@/features/production-orders/utils/format';
import { groupNeedLinesByCategory } from '@/features/production-orders/utils/need-lines';
import { FloorStepsPanel } from '@/features/production-orders/components/detail/FloorStepsPanel';
import { NeedCategoryBlock } from '@/features/production-orders/components/detail/NeedCategoryBlock';
import { RealProduzidoPanel } from '@/features/production-orders/components/detail/RealProduzidoPanel';
import {
  ActionButton,
  DetailBody,
  DetailCard,
  DetailCardAccent,
  HeaderGrid,
  MetaItem,
  MetaLabel,
  MetaValue,
  QControls,
  SecondaryActionButton,
} from '@/features/production-orders/components/detail/ProductionOrderDetail.styled';

type ProductionOrderDetailProps = {
  order: ProductionOrder;
  isMutating?: boolean;
  errorMessage?: string | null;
  onUpdateQ: (qtdAProduzir: number) => void | Promise<void>;
  onUpdateReal: (realProduzido: number) => void | Promise<void>;
  onUpdateSteps: (steps: ProductionStepInput[]) => void | Promise<void>;
  onRecalculate: () => void | Promise<void>;
};

export function ProductionOrderDetail({
  order,
  isMutating = false,
  errorMessage = null,
  onUpdateQ,
  onUpdateReal,
  onUpdateSteps,
  onRecalculate,
}: ProductionOrderDetailProps) {
  const { t } = useTranslation();
  const [qDisplay, setQDisplay] = useState(String(order.qtdAProduzir));

  useEffect(() => {
    setQDisplay(String(order.qtdAProduzir));
  }, [order.qtdAProduzir, order.id]);

  const groups = useMemo(
    () => groupNeedLinesByCategory(order.needLines),
    [order.needLines]
  );

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('productionOrders.errors.unexpected')
      : errorMessage;

  const handleSaveQ = () => {
    const nextQ = parseDecimalInput(qDisplay);
    if (!Number.isFinite(nextQ) || !(nextQ > 0)) {
      return;
    }
    if (nextQ === order.qtdAProduzir) {
      return;
    }
    void onUpdateQ(nextQ);
  };

  return (
    <DetailCard>
      <DetailCardAccent />
      <DetailBody>
        {displayError ? (
          <Alert severity="error" role="alert">
            {displayError}
          </Alert>
        ) : null}

        <HeaderGrid>
          <MetaItem>
            <MetaLabel>{t('productionOrders.detail.number')}</MetaLabel>
            <MetaValue>{order.number}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('productionOrders.detail.product')}</MetaLabel>
            <MetaValue>{order.product.name}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('productionOrders.detail.emitidaEm')}</MetaLabel>
            <MetaValue>{formatDateDisplay(order.emitidaEm)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('productionOrders.detail.yieldSnapshot')}</MetaLabel>
            <MetaValue>{formatDecimal(order.yieldSnapshot, 6)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('productionOrders.detail.totalMistura')}</MetaLabel>
            <MetaValue>{formatDecimal(order.totalMisturaKg, 6)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('productionOrders.detail.startDate')}</MetaLabel>
            <MetaValue>{formatDateDisplay(order.startDate)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('productionOrders.detail.plannedEndDate')}</MetaLabel>
            <MetaValue>{formatDateDisplay(order.plannedEndDate)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('productionOrders.detail.notes')}</MetaLabel>
            <MetaValue>{order.notes?.trim() ? order.notes : '—'}</MetaValue>
          </MetaItem>
        </HeaderGrid>

        <QControls>
          <FormTextField
            id="production-order-detail-q"
            label={t('productionOrders.detail.qLabel')}
            placeholder={t('productionOrders.form.qPlaceholder')}
            value={qDisplay}
            onChange={(value) => setQDisplay(sanitizeDecimalInput(value))}
            inputMode="decimal"
            disabled={isMutating}
          />
          <ActionButton
            type="button"
            variant="contained"
            disableElevation
            startIcon={<SaveOutlined />}
            disabled={isMutating}
            onClick={handleSaveQ}
          >
            {isMutating
              ? t('productionOrders.detail.savingQ')
              : t('productionOrders.detail.saveQ')}
          </ActionButton>
          <SecondaryActionButton
            type="button"
            startIcon={<RefreshOutlined />}
            disabled={isMutating}
            onClick={() => {
              void onRecalculate();
            }}
          >
            {t('productionOrders.detail.recalculate')}
          </SecondaryActionButton>
        </QControls>

        {groups.map((group) => (
          <NeedCategoryBlock
            key={group.category}
            category={group.category}
            lines={group.lines}
          />
        ))}

        <FloorStepsPanel
          steps={order.steps}
          plannedMinutesTotal={order.plannedMinutesTotal}
          isMutating={isMutating}
          onSave={onUpdateSteps}
        />

        <RealProduzidoPanel
          realProduzido={order.realProduzido}
          qtdAProduzir={order.qtdAProduzir}
          isMutating={isMutating}
          onSave={onUpdateReal}
        />
      </DetailBody>
    </DetailCard>
  );
}
