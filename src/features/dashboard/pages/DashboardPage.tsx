import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { DashboardKpiStrip } from '@/features/dashboard/components/DashboardKpiStrip';
import { DashboardPeriodFilter } from '@/features/dashboard/components/DashboardPeriodFilter';
import { MaterialDemandChart } from '@/features/dashboard/components/charts/MaterialDemandChart';
import { OrdersIssuedChart } from '@/features/dashboard/components/charts/OrdersIssuedChart';
import { OutputByProductChart } from '@/features/dashboard/components/charts/OutputByProductChart';
import { PlannedVsActualChart } from '@/features/dashboard/components/charts/PlannedVsActualChart';
import { ProductionVolumeChart } from '@/features/dashboard/components/charts/ProductionVolumeChart';
import { StockHealthChart } from '@/features/dashboard/components/charts/StockHealthChart';
import { useDashboardPeriod } from '@/features/dashboard/hooks/useDashboardPeriod';
import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboardSummary';
import {
  ChartsGrid,
  HeroRow,
  PageRoot,
} from '@/features/dashboard/pages/DashboardPage.styled';

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { enqueueToast } = useToast();
  const locale = i18n.language === 'en' ? 'en-US' : 'pt-BR';
  const {
    preset,
    setPreset,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    params,
    isReady,
  } = useDashboardPeriod();
  const { data, isLoading, errorMessage } = useDashboardSummary(
    params,
    isReady
  );
  const lastToastedError = useRef<string | null>(null);

  const loadError =
    errorMessage === 'UNEXPECTED'
      ? t('dashboard.errors.unexpected')
      : errorMessage;

  useEffect(() => {
    if (!loadError) {
      lastToastedError.current = null;
      return;
    }
    if (lastToastedError.current === loadError) {
      return;
    }
    lastToastedError.current = loadError;
    enqueueToast({
      severity: 'error',
      message: loadError,
    });
  }, [enqueueToast, loadError]);

  return (
    <PageRoot>
      <HeroRow>
        <Box>
          <PageTitle>{t('dashboard.title')}</PageTitle>
          <PageSubtitle>{t('dashboard.subtitle')}</PageSubtitle>
        </Box>
      </HeroRow>

      <DashboardPeriodFilter
        preset={preset}
        customFrom={customFrom}
        customTo={customTo}
        onPresetChange={setPreset}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
      />

      {loadError ? (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      ) : null}

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <CircularProgress size={32} aria-label={t('dashboard.loading')} />
        </Box>
      ) : null}

      {!isLoading && data ? (
        <>
          <DashboardKpiStrip kpis={data.kpis} locale={locale} />
          <ChartsGrid>
            <ProductionVolumeChart
              data={data.productionVolume}
              grain={params.grain}
              locale={locale}
            />
            <PlannedVsActualChart
              data={data.plannedVsActual}
              locale={locale}
            />
            <OutputByProductChart
              data={data.outputByProduct}
              locale={locale}
            />
            <OrdersIssuedChart
              data={data.ordersIssued}
              grain={params.grain}
              locale={locale}
            />
            <StockHealthChart data={data.stockHealth} locale={locale} />
            {data.materialDemand.items.length > 0 ? (
              <MaterialDemandChart
                data={data.materialDemand}
                locale={locale}
              />
            ) : null}
          </ChartsGrid>
        </>
      ) : null}
    </PageRoot>
  );
}
