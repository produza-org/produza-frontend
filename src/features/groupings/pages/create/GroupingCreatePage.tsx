import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import {
  GroupingCreateWizard,
  type GroupingCreateWizardSaveInput,
} from '@/features/groupings/components/create/GroupingCreateWizard';
import { useGroupingsContext } from '@/features/groupings/context/GroupingsContext';
import {
  PageHeader,
  PageRoot,
} from '@/features/groupings/pages/GroupingFormPage.styled';
import { listAllRawMaterials } from '@/features/raw-materials/api';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

export function GroupingCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { createGrouping } = useGroupingsContext();
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function prefetchMaterials() {
      setIsLoadingMaterials(true);
      try {
        const loaded = await listAllRawMaterials();
        if (!cancelled) {
          setMaterials(loaded);
        }
      } catch {
        if (!cancelled) {
          setMaterials([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMaterials(false);
        }
      }
    }

    void prefetchMaterials();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/groupings');
  }, [navigate]);

  const handleSave = useCallback(
    async (input: GroupingCreateWizardSaveInput) => {
      setIsSubmitting(true);
      try {
        await createGrouping(input);
        enqueueToast({
          severity: 'success',
          message: t('groupings.toasts.created'),
        });
        navigate('/groupings');
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : t('groupings.errors.unexpected');
        enqueueToast({ severity: 'error', message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [createGrouping, enqueueToast, navigate, t]
  );

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('groupings.form.title')}</PageTitle>
        <PageSubtitle>{t('groupings.form.subtitle')}</PageSubtitle>
      </PageHeader>

      {isLoadingMaterials ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress
            size={32}
            aria-label={t('groupings.createWizard.loadingMaterials')}
          />
        </Box>
      ) : (
        <GroupingCreateWizard
          materials={materials}
          onCancel={handleCancel}
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />
      )}
    </PageRoot>
  );
}
