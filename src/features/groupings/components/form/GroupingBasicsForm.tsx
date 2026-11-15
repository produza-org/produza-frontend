import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Alert from '@mui/material/Alert';
import { FormTextField } from '@/shared/components/form';
import {
  CancelButton,
  FormActions,
  FormBody,
  FormCard,
  FormCardAccent,
  FormRow,
  SaveButton,
} from '@/features/groupings/components/form/GroupingBasicsForm.styled';
import type {
  GroupingBasicsFormValues,
  GroupingBasicsSubmitValues,
} from '@/features/groupings/types/grouping-form';
import {
  isBasicsValid,
  toBasicsSubmitValues,
} from '@/features/groupings/utils/form/general-info';

type GroupingBasicsFormProps = {
  onSubmit: (values: GroupingBasicsSubmitValues) => void | Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<GroupingBasicsFormValues>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onDirtyChange?: (isDirty: boolean) => void;
};

const defaultValues: GroupingBasicsFormValues = {
  name: '',
  code: '',
  description: '',
};

export function GroupingBasicsForm({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  errorMessage = null,
  onDirtyChange,
}: GroupingBasicsFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<GroupingBasicsFormValues>({
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const name = useWatch({ control, name: 'name' });
  const code = useWatch({ control, name: 'code' });
  const description = useWatch({ control, name: 'description' });

  const isStepValid = isBasicsValid({
    name: name ?? '',
    code: code ?? '',
    description: description ?? '',
  });

  useEffect(() => {
    if (!onDirtyChange) {
      return;
    }
    onDirtyChange(
      Boolean(name?.trim()) ||
        Boolean(code?.trim()) ||
        Boolean(description?.trim())
    );
  }, [code, description, name, onDirtyChange]);

  const displayError =
    errorMessage === 'UNEXPECTED'
      ? t('groupings.errors.unexpected')
      : errorMessage;

  const submitForm = handleSubmit((values) => {
    if (!isBasicsValid(values)) {
      return;
    }
    void onSubmit(toBasicsSubmitValues(values));
  });

  return (
    <FormCard>
      <FormCardAccent />
      <FormBody onSubmit={submitForm} noValidate>
        {displayError ? (
          <Alert severity="error" role="alert">
            {displayError}
          </Alert>
        ) : null}

        <FormRow>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="grouping-name"
                label={t('groupings.form.nameLabel')}
                placeholder={t('groupings.form.namePlaceholder')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="grouping-code"
                label={t('groupings.form.codeLabel')}
                placeholder={t('groupings.form.codePlaceholder')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormRow>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormTextField
              id="grouping-description"
              label={t('groupings.form.descriptionLabel')}
              placeholder={t('groupings.form.descriptionPlaceholder')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <FormActions>
          <CancelButton type="button" onClick={onCancel} disabled={isSubmitting}>
            {t('groupings.form.cancel')}
          </CancelButton>
          <SaveButton
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            endIcon={<ArrowForward />}
            disabled={isSubmitting || !isStepValid}
          >
            {t('groupings.createWizard.next')}
          </SaveButton>
        </FormActions>
      </FormBody>
    </FormCard>
  );
}
