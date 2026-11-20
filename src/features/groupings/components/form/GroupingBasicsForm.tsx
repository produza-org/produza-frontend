import { useEffect, type FormEvent } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { FormTextField } from '@/shared/components/form';
import {
  FormValidationProvider,
  useFormValidation,
} from '@/shared/form-validation';
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
import { toBasicsSubmitValues } from '@/features/groupings/utils/form/general-info';
import {
  GROUPING_BASICS_FIELD_ORDER,
  validateGroupingBasics,
} from '@/features/groupings/utils/form/validate-basics';

type GroupingBasicsFormProps = {
  onSubmit: (values: GroupingBasicsSubmitValues) => void | Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<GroupingBasicsFormValues>;
  isSubmitting?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
};

const defaultValues: GroupingBasicsFormValues = {
  name: '',
  code: '',
  description: '',
};

function GroupingBasicsFormFields({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
  onDirtyChange,
}: GroupingBasicsFormProps) {
  const { t } = useTranslation();
  const { getError, clearField, submitWithValidation } = useFormValidation();
  const { control, getValues } = useForm<GroupingBasicsFormValues>({
    defaultValues: { ...defaultValues, ...initialValues },
  });

  const name = useWatch({ control, name: 'name' });
  const code = useWatch({ control, name: 'code' });
  const description = useWatch({ control, name: 'description' });

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

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitWithValidation(
      () =>
        validateGroupingBasics(getValues(), {
          nameRequired: t('groupings.form.errors.nameRequired'),
          codeRequired: t('groupings.form.errors.codeRequired'),
        }),
      () => {
        void onSubmit(toBasicsSubmitValues(getValues()));
      },
      [...GROUPING_BASICS_FIELD_ORDER]
    );
  }

  return (
    <FormCard>
      <FormCardAccent />
      <FormBody onSubmit={handleFormSubmit} noValidate>
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
                onChange={(value) => {
                  clearField('grouping-name');
                  field.onChange(value);
                }}
                error={Boolean(getError('grouping-name'))}
                helperText={getError('grouping-name')}
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
                onChange={(value) => {
                  clearField('grouping-code');
                  field.onChange(value);
                }}
                error={Boolean(getError('grouping-code'))}
                helperText={getError('grouping-code')}
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
            disabled={isSubmitting}
          >
            {t('groupings.createWizard.next')}
          </SaveButton>
        </FormActions>
      </FormBody>
    </FormCard>
  );
}

export function GroupingBasicsForm(props: GroupingBasicsFormProps) {
  return (
    <FormValidationProvider>
      <GroupingBasicsFormFields {...props} />
    </FormValidationProvider>
  );
}
