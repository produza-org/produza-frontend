import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { DashboardKpiCard } from '@/features/dashboard/components/DashboardKpiCard';
import { KpiGrid } from '@/features/dashboard/pages/DashboardPage.styled';
import type { DashboardKpis } from '@/features/dashboard/types/dashboard';
import {
  formatDashboardNumber,
  formatDashboardPercent,
} from '@/features/dashboard/utils/format';

type DashboardKpiStripProps = {
  kpis: DashboardKpis;
  locale: string;
};

export function DashboardKpiStrip({ kpis, locale }: DashboardKpiStripProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const p = theme.palette.produza;

  return (
    <KpiGrid>
      <DashboardKpiCard
        accentColor={p.primary}
        label={t('dashboard.kpis.ordersIssued')}
        value={formatDashboardNumber(kpis.ordersIssued, locale)}
      />
      <DashboardKpiCard
        accentColor={p.confirm}
        label={t('dashboard.kpis.actualProduced')}
        value={formatDashboardNumber(kpis.actualProduced, locale)}
      />
      <DashboardKpiCard
        accentColor={p.secondary}
        label={t('dashboard.kpis.avgFulfillment')}
        value={formatDashboardPercent(kpis.avgFulfillment, locale)}
      />
      <DashboardKpiCard
        accentColor={p.error}
        label={t('dashboard.kpis.materialsBelowMin')}
        value={formatDashboardNumber(kpis.materialsBelowMin, locale)}
        valueErrorTone={kpis.materialsBelowMin > 0}
      />
      <DashboardKpiCard
        accentColor={p.tertiaryFixedDim}
        label={t('dashboard.kpis.productsWithRecipe')}
        value={formatDashboardNumber(kpis.productsWithRecipe, locale)}
      />
      <DashboardKpiCard
        accentColor={p.warning}
        label={t('dashboard.kpis.productsWithoutRecipe')}
        value={formatDashboardNumber(kpis.productsWithoutRecipe, locale)}
      />
    </KpiGrid>
  );
}
