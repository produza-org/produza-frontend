import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export { PageRoot } from '@/shared/components/page';

export const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));
