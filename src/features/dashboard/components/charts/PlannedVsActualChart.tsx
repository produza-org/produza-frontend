import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/features/dashboard/components/ChartCard';
import { getChartColors } from '@/features/dashboard/components/charts/chartTheme';
import type { PlannedVsActualTotals } from '@/features/dashboard/types/dashboard';
import { formatDashboardNumber } from '@/features/dashboard/utils/format';

type PlannedVsActualChartProps = {
  data: PlannedVsActualTotals;
  locale: string;
};

export function PlannedVsActualChart({
  data,
  locale,
}: PlannedVsActualChartProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = getChartColors(theme);

  const chartData = [
    {
      name: t('dashboard.charts.series.planned'),
      value: data.plannedQuantity,
      fill: colors.planned,
    },
    {
      name: t('dashboard.charts.series.actual'),
      value: data.actualProduced,
      fill: colors.actual,
    },
  ];

  return (
    <ChartCard
      title={t('dashboard.charts.plannedVsActual.title')}
      subtitle={t('dashboard.charts.plannedVsActual.variation', {
        value: formatDashboardNumber(data.netVariation, locale),
      })}
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: colors.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
          />
          <YAxis
            tick={{ fill: colors.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(value: number) => formatDashboardNumber(value, locale)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              borderColor: colors.tooltipBorder,
              borderRadius: 8,
            }}
            formatter={(value: number) => formatDashboardNumber(value, locale)}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
