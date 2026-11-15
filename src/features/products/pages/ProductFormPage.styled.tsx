import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const PageRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 4, 4),
}));

export const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));
