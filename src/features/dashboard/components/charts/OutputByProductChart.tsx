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
import type { OutputByProductSummary } from '@/features/dashboard/types/dashboard';
import { formatDashboardNumber } from '@/features/dashboard/utils/format';

type OutputByProductChartProps = {
  data: OutputByProductSummary;
  locale: string;
};

export function OutputByProductChart({
  data,
  locale,
}: OutputByProductChartProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = getChartColors(theme);
  const valueKey = data.usedPlannedFallback
    ? 'plannedQuantity'
    : 'actualProduced';

  const chartData = [...data.items]
    .map((row) => ({
      name: row.productName,
      value: row[valueKey],
    }))
    .reverse();

  return (
    <ChartCard
      title={t('dashboard.charts.outputByProduct.title')}
      subtitle={
        data.usedPlannedFallback
          ? t('dashboard.charts.outputByProduct.plannedFallback')
          : undefined
      }
    >
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
              data.usedPlannedFallback
                ? t('dashboard.charts.series.planned')
                : t('dashboard.charts.series.actual'),
            ]}
          />
          <Bar
            dataKey="value"
            fill={data.usedPlannedFallback ? colors.planned : colors.primary}
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
