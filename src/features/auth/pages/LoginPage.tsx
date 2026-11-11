import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuthBootstrap } from '@/features/auth/hooks/useAuthBootstrap';
import {
  LoginCard,
  LoginPageRoot,
} from '@/features/auth/pages/LoginPage.styled';

export function LoginPage() {
  const { t } = useTranslation();
  const status = useAuthBootstrap();

  if (status === 'idle' || status === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={32} aria-label="Loading session" />
      </Box>
    );
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return (
    <LoginPageRoot>
      <LoginCard elevation={0}>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              {t('layout.header.productName')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('auth.login.subtitle')}
            </Typography>
          </Stack>
          <LoginForm />
        </Stack>
      </LoginCard>
    </LoginPageRoot>
  );
}
