import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/features/dashboard/components/ChartCard';
import { getChartColors } from '@/features/dashboard/components/charts/chartTheme';
import type {
  DashboardGrain,
  ProductionVolumePoint,
} from '@/features/dashboard/types/dashboard';
import { formatDashboardNumber } from '@/features/dashboard/utils/format';
import { formatBucketLabel } from '@/features/dashboard/utils/period';

type ProductionVolumeChartProps = {
  data: ProductionVolumePoint[];
  grain: DashboardGrain;
  locale: string;
};

export function ProductionVolumeChart({
  data,
  grain,
  locale,
}: ProductionVolumeChartProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = getChartColors(theme);

  const chartData = data.map((point) => ({
    ...point,
    label: formatBucketLabel(point.bucket, grain, locale),
  }));

  return (
    <ChartCard title={t('dashboard.charts.productionVolume.title')}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
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
            formatter={(value: number, name: string) => [
              formatDashboardNumber(value, locale),
              name === 'plannedQuantity'
                ? t('dashboard.charts.series.planned')
                : t('dashboard.charts.series.actual'),
            ]}
          />
          <Legend
            formatter={(value) =>
              value === 'plannedQuantity'
                ? t('dashboard.charts.series.planned')
                : t('dashboard.charts.series.actual')
            }
          />
          <Line
            type="monotone"
            dataKey="plannedQuantity"
            stroke={colors.planned}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actualProduced"
            stroke={colors.actual}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
