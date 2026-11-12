import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const FloorSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  borderRadius: 12,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
}));

export const FloorSectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const FloorSectionTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.slate500,
}));

export const PlannedLoadBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
  borderRadius: 6,
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  fontSize: 12,
  fontWeight: 700,
  color: theme.palette.produza.onSurface,
  fontVariantNumeric: 'tabular-nums',
}));

export const StepRows = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const StepRowRoot = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  alignItems: 'end',
  padding: theme.spacing(2),
  borderRadius: 10,
  backgroundColor: theme.palette.produza.surfaceContainerLowest,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.2fr) 40px',
  },
}));

export const RemoveStepButton = styled(Button)(({ theme }) => ({
  minWidth: 40,
  width: 40,
  height: 40,
  padding: 0,
  borderRadius: 6,
  color: theme.palette.produza.error,
  '&:hover': {
    backgroundColor: `${theme.palette.produza.error}14`,
  },
}));

export const FloorActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const AddStepButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: 13,
  color: theme.palette.produza.primary,
  borderRadius: 6,
  '&:hover': {
    backgroundColor: `${theme.palette.produza.primary}14`,
  },
}));

export const RealControls = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr',
  alignItems: 'end',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(0, 220px) auto auto',
  },
}));

export const VariationBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$tone',
})<{ $tone: 'neutral' | 'positive' | 'negative' }>(({ theme, $tone }) => {
  const toneColor =
    $tone === 'positive'
      ? theme.palette.produza.success
      : $tone === 'negative'
        ? theme.palette.produza.error
        : theme.palette.produza.onSurfaceVariant;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    alignSelf: 'end',
    minHeight: 40,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: 6,
    border: `1px solid ${toneColor}4D`,
    backgroundColor:
      $tone === 'positive'
        ? theme.palette.produza.successContainer
        : $tone === 'negative'
          ? theme.palette.produza.errorContainer
          : theme.palette.produza.surfaceContainerLowest,
    color: toneColor,
    fontSize: 13,
    fontWeight: 800,
    fontVariantNumeric: 'tabular-nums',
  };
});

export const EmptySteps = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 13,
  color: theme.palette.produza.onSurfaceVariant,
}));
