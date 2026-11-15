import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const StyledDetailDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: `${theme.palette.produza.primary}33`,
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  },
  '& .MuiDrawer-paper': {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.produza.surfaceContainerLowest,
    borderLeft: `1px solid ${theme.palette.produza.outlineVariant}`,
    boxShadow: `-12px 0 32px ${theme.palette.produza.primary}14`,
    [theme.breakpoints.up('sm')]: {
      width: 420,
      maxWidth: 420,
    },
    [theme.breakpoints.up('md')]: {
      width: 480,
      maxWidth: 480,
    },
  },
}));

export const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.produza.outlineVariant}66`,
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2.5),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2.5),
  },
}));

export const DrawerTitleBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 0,
  flex: 1,
}));

export const DrawerTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1.3,
  color: theme.palette.produza.onSurface,
  overflowWrap: 'anywhere',
  [theme.breakpoints.up('sm')]: {
    fontSize: 20,
  },
})) as typeof Typography;

export const DrawerSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.4,
  color: theme.palette.produza.onSurfaceVariant,
  overflowWrap: 'anywhere',
})) as typeof Typography;

export const DrawerCloseButton = styled(IconButton)(({ theme }) => ({
  marginTop: -4,
  color: theme.palette.produza.onSurfaceVariant,
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.produza.surfaceContainerLow,
    color: theme.palette.produza.onSurface,
  },
}));

export const DrawerBody = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(3),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export const DrawerFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2.5),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  borderTop: `1px solid ${theme.palette.produza.outlineVariant}66`,
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export const DetailSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const DetailSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.palette.produza.slate500,
})) as typeof Typography;

export const DetailFacts = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  borderRadius: 10,
  border: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  backgroundColor: theme.palette.produza.surfaceContainerLow,
  overflow: 'hidden',
}));

export const DetailFactRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.produza.outlineVariant}4D`,
  '&:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
}));

export const DetailFactLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 600,
  color: theme.palette.produza.onSurfaceVariant,
  flexShrink: 0,
})) as typeof Typography;

export const DetailFactValue = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 700,
  color: theme.palette.produza.onSurface,
  fontVariantNumeric: 'tabular-nums',
  overflowWrap: 'anywhere',
  textAlign: 'left',
  [theme.breakpoints.up('sm')]: {
    textAlign: 'right',
  },
})) as typeof Typography;

export const DrawerLoadingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));
