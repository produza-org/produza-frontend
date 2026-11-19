import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import type { ReactNode } from 'react';

const Root = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  border: `1px solid ${theme.palette.produza.outlineVariant}`,
  borderRadius: 12,
  padding: theme.spacing(2),
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.5),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: 0,
  fontSize: 14,
  fontWeight: 800,
  color: theme.palette.produza.onSurface,
  letterSpacing: '-0.02em',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.produza.onSurfaceVariant,
  marginTop: theme.spacing(0.25),
}));

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Root>
      <Box>
        <Title>{title}</Title>
        {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </Box>
      <Box sx={{ width: '100%', minHeight: 220 }}>{children}</Box>
    </Root>
  );
}
