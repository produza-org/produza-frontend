import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const StyledDetailDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: `${theme.palette.produza.primary}33`,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  '& .MuiDrawer-paper': {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: theme.palette.produza.surfaceContainerLowest,
    borderLeft: 'none',
    boxShadow: `-16px 0 40px ${theme.palette.produza.primary}1A`,
    [theme.breakpoints.up('sm')]: {
      width: 448,
      maxWidth: 448,
    },
  },
}));

export const DrawerCloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1,
  color: theme.palette.produza.onSurfaceVariant,
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.produza.surfaceContainerLow,
    color: theme.palette.produza.onSurface,
  },
}));

export const DrawerScrollArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
}));

export const DrawerEyebrow = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(0.5),
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.palette.produza.secondary,
})) as typeof Typography;

export const DrawerTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontSize: '1.5rem',
  fontWeight: 700,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  color: theme.palette.produza.primary,
  overflowWrap: 'anywhere',
})) as typeof Typography;

export const DrawerStatsCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
}));

export const DrawerStatBlock = styled(Box)({
  minWidth: 0,
  flex: 1,
});

export const DrawerStatBlockEnd = styled(DrawerStatBlock)({
  textAlign: 'right',
});

export const DrawerStatLabel = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  fontSize: '0.625rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.palette.produza.secondary,
})) as typeof Typography;

export const DrawerStatValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  lineHeight: 1.2,
  color: theme.palette.produza.onSurface,
  fontVariantNumeric: 'tabular-nums',
  overflowWrap: 'anywhere',
})) as typeof Typography;

export const DrawerStatValueCompact = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.2,
  color: theme.palette.produza.onSurface,
  fontVariantNumeric: 'tabular-nums',
  overflowWrap: 'anywhere',
})) as typeof Typography;

export const DrawerHairline = styled(Box)(({ theme }) => ({
  height: 1,
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.produza.outlineVariant,
  opacity: 0.2,
}));

export const DrawerFooter = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  flexShrink: 0,
  padding: theme.spacing(4),
  backgroundColor: `${theme.palette.produza.surfaceContainerLow}80`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}));

export const DrawerFooterActions = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1.5),
}));

export const DrawerEditButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.875rem',
  borderRadius: 8,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  boxShadow: `0 8px 20px ${theme.palette.produza.primary}1A`,
  backgroundColor: theme.palette.produza.primary,
  color: theme.palette.produza.onPrimary,
  '&:hover': {
    backgroundColor: theme.palette.produza.primaryContainer,
    opacity: 0.95,
  },
}));

export const DrawerDeleteButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  borderRadius: 8,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderColor: `${theme.palette.produza.outlineVariant}4D`,
  color: theme.palette.produza.error,
  '&:hover': {
    borderColor: `${theme.palette.produza.outlineVariant}4D`,
    backgroundColor: `${theme.palette.produza.errorContainer}33`,
  },
}));

export const BreakdownSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const BreakdownSectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.palette.produza.onSurfaceVariant,
})) as typeof Typography;

export const BreakdownList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const BreakdownRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  borderRadius: 8,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    backgroundColor: theme.palette.produza.surfaceContainerLow,
  },
}));

export const BreakdownRowStart = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  minWidth: 0,
}));

export const BreakdownDot = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  flexShrink: 0,
  borderRadius: '50%',
  backgroundColor: theme.palette.produza.tertiaryFixedDim,
}));

export const BreakdownPrimary = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.produza.onSurface,
  overflowWrap: 'anywhere',
})) as typeof Typography;

export const BreakdownSecondary = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 400,
  color: theme.palette.produza.secondary,
  overflowWrap: 'anywhere',
})) as typeof Typography;

export const BreakdownRowEnd = styled(Box)({
  textAlign: 'right',
  flexShrink: 0,
});

export const BreakdownValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 700,
  color: theme.palette.produza.onSurface,
  fontVariantNumeric: 'tabular-nums',
})) as typeof Typography;

export const BreakdownValueSecondary = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 400,
  color: theme.palette.produza.secondary,
  fontVariantNumeric: 'tabular-nums',
})) as typeof Typography;

export const DrawerLoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));
