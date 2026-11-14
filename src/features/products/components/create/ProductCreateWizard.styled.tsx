import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';

export const WizardRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

export const WizardStepper = styled(Stepper)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  '& .MuiStepLabel-label': {
    fontWeight: 700,
    fontSize: 14,
  },
  '& .MuiStepIcon-root': {
    color: theme.palette.produza.outlineVariant,
  },
  '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.produza.primary,
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: theme.palette.produza.primary,
  },
}));

export const StepTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: 18,
  fontWeight: 800,
  color: theme.palette.produza.onSurface,
  outline: 'none',
}));

export const StepPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const WizardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

export const SecondaryButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  color: theme.palette.produza.secondary,
  borderRadius: 6,
  '&:hover': {
    backgroundColor: `${theme.palette.produza.secondary}1A`,
  },
}));

export const PrimaryButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'none',
  color: theme.palette.produza.onPrimary,
  backgroundColor: theme.palette.produza.primary,
  borderRadius: 6,
  boxShadow: `0 10px 15px -3px ${theme.palette.produza.primary}33`,
  '&:hover': {
    opacity: 0.9,
    backgroundColor: theme.palette.produza.primary,
  },
  '&:active': { transform: 'scale(0.95)' },
  '&.Mui-disabled': {
    color: theme.palette.produza.onPrimary,
    backgroundColor: `${theme.palette.produza.primary}66`,
  },
}));
