import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import type { DashboardPeriodPreset } from '@/features/dashboard/types/dashboard';

const FilterRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const CustomRange = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    width: 'auto',
    flexWrap: 'wrap',
  },
}));

const periodToggleSx = {
  width: '100%',
  flexWrap: 'wrap' as const,
  '& .MuiToggleButton-root': {
    flex: '1 1 auto',
    textTransform: 'none' as const,
    fontWeight: 700,
    fontSize: 13,
  },
};

type DashboardPeriodFilterProps = {
  preset: DashboardPeriodPreset;
  customFrom: string;
  customTo: string;
  onPresetChange: (preset: DashboardPeriodPreset) => void;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
};

export function DashboardPeriodFilter({
  preset,
  customFrom,
  customTo,
  onPresetChange,
  onCustomFromChange,
  onCustomToChange,
}: DashboardPeriodFilterProps) {
  const { t } = useTranslation();

  return (
    <FilterRow>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={preset}
        aria-label={t('dashboard.period.ariaLabel')}
        onChange={(_, value: DashboardPeriodPreset | null) => {
          if (value) {
            onPresetChange(value);
          }
        }}
        sx={periodToggleSx}
      >
        <ToggleButton value="day">{t('dashboard.period.day')}</ToggleButton>
        <ToggleButton value="week">{t('dashboard.period.week')}</ToggleButton>
        <ToggleButton value="month">{t('dashboard.period.month')}</ToggleButton>
        <ToggleButton value="custom">{t('dashboard.period.custom')}</ToggleButton>
      </ToggleButtonGroup>

      {preset === 'custom' ? (
        <CustomRange>
          <TextField
            type="date"
            size="small"
            label={t('dashboard.period.from')}
            value={customFrom}
            onChange={(event) => onCustomFromChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ minWidth: { sm: 160 } }}
          />
          <TextField
            type="date"
            size="small"
            label={t('dashboard.period.to')}
            value={customTo}
            onChange={(event) => onCustomToChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ minWidth: { sm: 160 } }}
          />
        </CustomRange>
      ) : null}
    </FilterRow>
  );
}
