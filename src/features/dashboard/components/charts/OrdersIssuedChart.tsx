import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/features/dashboard/components/ChartCard';
import { getChartColors } from '@/features/dashboard/components/charts/chartTheme';
import type {
  DashboardGrain,
  OrdersIssuedPoint,
} from '@/features/dashboard/types/dashboard';
import { formatDashboardNumber } from '@/features/dashboard/utils/format';
import { formatBucketLabel } from '@/features/dashboard/utils/period';

type OrdersIssuedChartProps = {
  data: OrdersIssuedPoint[];
  grain: DashboardGrain;
  locale: string;
};

export function OrdersIssuedChart({
  data,
  grain,
  locale,
}: OrdersIssuedChartProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = getChartColors(theme);

  const chartData = data.map((point) => ({
    ...point,
    label: formatBucketLabel(point.bucket, grain, locale),
  }));

  return (
    <ChartCard title={t('dashboard.charts.ordersIssued.title')}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: colors.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: colors.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              borderColor: colors.tooltipBorder,
              borderRadius: 8,
            }}
            formatter={(value: number, name: string) => [
              formatDashboardNumber(value, locale),
              name === 'withActual'
                ? t('dashboard.charts.series.withActual')
                : t('dashboard.charts.series.withoutActual'),
            ]}
          />
          <Legend
            formatter={(value) =>
              value === 'withActual'
                ? t('dashboard.charts.series.withActual')
                : t('dashboard.charts.series.withoutActual')
            }
          />
          <Bar
            dataKey="withActual"
            stackId="orders"
            fill={colors.actual}
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="withoutActual"
            stackId="orders"
            fill={colors.planned}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
