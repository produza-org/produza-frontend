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
import type { MaterialDemandSummary } from '@/features/dashboard/types/dashboard';
import { formatDashboardNumber } from '@/features/dashboard/utils/format';

type MaterialDemandChartProps = {
  data: MaterialDemandSummary;
  locale: string;
};

export function MaterialDemandChart({
  data,
  locale,
}: MaterialDemandChartProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = getChartColors(theme);

  const chartData = [...data.items]
    .map((row) => ({
      name: row.name || row.code,
      quantity: row.quantity,
      unit: row.unit,
    }))
    .reverse();

  return (
    <ChartCard title={t('dashboard.charts.materialDemand.title')}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: colors.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
            tickFormatter={(value: number) => formatDashboardNumber(value, locale)}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={96}
            tick={{ fill: colors.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              borderColor: colors.tooltipBorder,
              borderRadius: 8,
            }}
            formatter={(value: number) => [
              formatDashboardNumber(value, locale),
              t('dashboard.charts.series.demand'),
            ]}
          />
          <Bar dataKey="quantity" fill={colors.secondary} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
