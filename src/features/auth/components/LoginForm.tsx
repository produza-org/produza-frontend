import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FormTextField } from '@/shared/components/form';
import type { LoginCredentials } from '@/core/types';
import { useLogin } from '@/features/auth/hooks/useLogin';

type LoginFormValues = LoginCredentials;

export function LoginForm() {
  const { t } = useTranslation();
  const { login, isSubmitting, errorMessage } = useLogin();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('auth.login.unexpectedError')
      : errorMessage;

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={handleSubmit((values) => void login(values))}
      noValidate
    >
      {displayError ? (
        <Alert severity="error" role="alert">
          {displayError}
        </Alert>
      ) : null}

      <Controller
        name="email"
        control={control}
        rules={{ required: t('auth.login.emailRequired') }}
        render={({ field, fieldState }) => (
          <FormTextField
            id="login-email"
            label={t('auth.login.emailLabel')}
            placeholder={t('auth.login.emailPlaceholder')}
            value={field.value}
            onChange={field.onChange}
            type="email"
            autoComplete="username"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: t('auth.login.passwordRequired') }}
        render={({ field, fieldState }) => (
          <FormTextField
            id="login-password"
            label={t('auth.login.passwordLabel')}
            placeholder={t('auth.login.passwordPlaceholder')}
            value={field.value}
            onChange={field.onChange}
            type="password"
            autoComplete="current-password"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
      </Button>
    </Stack>
  );
}
