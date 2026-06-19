import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Root = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  padding: theme.spacing(3),
  borderRadius: 12,
  borderLeftWidth: 4,
  borderLeftStyle: 'solid',
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 900,
  color: theme.palette.produza.slate500,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: theme.spacing(0.5),
}));

const Value = styled(Typography, {
  shouldForwardProp: (p) => p !== '$errorTone',
})<{ $errorTone?: boolean }>(({ theme, $errorTone }) => ({
  fontSize: 24,
  fontWeight: 900,
  fontVariantNumeric: 'tabular-nums',
  color: $errorTone ? theme.palette.produza.error : theme.palette.produza.onSurface,
  lineHeight: 1.2,
}));

type RawMaterialsStatCardProps = {
  accentColor: string;
  label: string;
  value: string;
  valueErrorTone?: boolean;
};

export function RawMaterialsStatCard({
  accentColor,
  label,
  value,
  valueErrorTone,
}: RawMaterialsStatCardProps) {
  return (
    <Root sx={{ borderLeftColor: accentColor }}>
      <Label>{label}</Label>
      <Value $errorTone={valueErrorTone}>{value}</Value>
    </Root>
  );
}
