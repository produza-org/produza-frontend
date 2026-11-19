import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from '@/features/dashboard/components/ChartCard';
import { getChartColors } from '@/features/dashboard/components/charts/chartTheme';
import type { StockHealthSummary } from '@/features/dashboard/types/dashboard';
import {
  formatDashboardCurrency,
  formatDashboardNumber,
} from '@/features/dashboard/utils/format';

type StockHealthChartProps = {
  data: StockHealthSummary;
  locale: string;
};

export function StockHealthChart({ data, locale }: StockHealthChartProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = getChartColors(theme);

  const chartData = [
    {
      key: 'ok',
      name: t('dashboard.charts.stockHealth.ok'),
      value: data.ok,
      fill: colors.success,
    },
    {
      key: 'belowMin',
      name: t('dashboard.charts.stockHealth.belowMin'),
      value: data.belowMin,
      fill: colors.warning,
    },
    {
      key: 'outOfStock',
      name: t('dashboard.charts.stockHealth.outOfStock'),
      value: data.outOfStock,
      fill: colors.error,
    },
  ].filter((slice) => slice.value > 0);

  const empty = chartData.length === 0;

  return (
    <ChartCard
      title={t('dashboard.charts.stockHealth.title')}
      subtitle={t('dashboard.charts.stockHealth.subtitle', {
        value: formatDashboardCurrency(data.inventoryValue, locale),
      })}
    >
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={
              empty
                ? [
                    {
                      key: 'empty',
                      name: t('dashboard.charts.stockHealth.empty'),
                      value: 1,
                      fill: colors.grid,
                    },
                  ]
                : chartData
            }
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={empty ? 0 : 2}
          >
            {(empty ? [{ key: 'empty', fill: colors.grid }] : chartData).map(
              (slice) => (
                <Cell key={slice.key} fill={slice.fill} />
              )
            )}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              borderColor: colors.tooltipBorder,
              borderRadius: 8,
            }}
            formatter={(value: number, name: string) =>
              empty
                ? [t('dashboard.charts.stockHealth.empty'), name]
                : [formatDashboardNumber(value, locale), name]
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
