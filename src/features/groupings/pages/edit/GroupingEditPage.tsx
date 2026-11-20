import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ApiError } from '@/core/api';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { useToast } from '@/shared/toast';
import { getRawMaterialGroup } from '@/features/groupings/api';
import {
  GroupingCreateWizard,
  type GroupingCreateWizardSaveInput,
} from '@/features/groupings/components/create/GroupingCreateWizard';
import { useGroupingsContext } from '@/features/groupings/context/GroupingsContext';
import {
  PageHeader,
  PageRoot,
} from '@/features/groupings/pages/GroupingFormPage.styled';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import type { GroupingBasicsSubmitValues } from '@/features/groupings/types/grouping-form';
import {
  createDraftLineKey,
  type GroupingDraftLine,
} from '@/features/groupings/utils/composition/draft-lines';
import { listAllRawMaterials } from '@/features/raw-materials/api';
import type { RawMaterial } from '@/features/raw-materials/types/raw-material';

function toDraftLines(item: RawMaterialGroup): GroupingDraftLine[] {
  return (item.lines ?? []).map((line) => ({
    key: createDraftLineKey(),
    rawMaterialId: line.rawMaterialId,
    quantityDisplay: String(line.quantity),
    code: line.rawMaterial?.code ?? '',
    name: line.rawMaterial?.name ?? line.rawMaterialId,
    unit: line.rawMaterial?.unit ?? '',
    unitCost: line.rawMaterial?.unitCost ?? 0,
    stockQuantity: line.rawMaterial?.stockQuantity ?? 0,
  }));
}

function toBasics(item: RawMaterialGroup): GroupingBasicsSubmitValues {
  return {
    name: item.name,
    code: item.code,
    ...(item.description ? { description: item.description } : {}),
  };
}

export function GroupingEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { items, updateGrouping } = useGroupingsContext();
  const [item, setItem] = useState<RawMaterialGroup | null>(null);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cachedItem = useMemo(
    () => (id ? items.find((entry) => entry.id === id) ?? null : null),
    [items, id]
  );

  useEffect(() => {
    if (!id) {
      navigate('/groupings');
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [loadedGroup, loadedMaterials] = await Promise.all([
          cachedItem && (cachedItem.lines?.length ?? 0) > 0
            ? Promise.resolve(cachedItem)
            : getRawMaterialGroup(id!),
          listAllRawMaterials(),
        ]);
        if (!cancelled) {
          setItem(loadedGroup);
          setMaterials(loadedMaterials);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 404) {
            navigate('/groupings');
            return;
          }
          setLoadError(error instanceof ApiError ? error.message : 'UNEXPECTED');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [cachedItem, id, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/groupings');
  }, [navigate]);

  const handleSave = useCallback(
    async (input: GroupingCreateWizardSaveInput) => {
      if (!id) {
        return;
      }
      setIsSubmitting(true);
      try {
        await updateGrouping(id, input);
        enqueueToast({
          severity: 'success',
          message: t('groupings.toasts.updated'),
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
    [enqueueToast, id, navigate, t, updateGrouping]
  );

  const displayLoadError =
    loadError === 'UNEXPECTED' ? t('groupings.errors.unexpected') : loadError;

  if (isLoading) {
    return (
      <PageRoot>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} aria-label={t('groupings.form.loading')} />
        </Box>
      </PageRoot>
    );
  }

  if (displayLoadError) {
    return (
      <PageRoot>
        <Alert severity="error" role="alert">
          {displayLoadError}
        </Alert>
      </PageRoot>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <PageRoot>
      <PageHeader>
        <PageTitle>{t('groupings.form.editTitle')}</PageTitle>
        <PageSubtitle>{t('groupings.form.editSubtitle')}</PageSubtitle>
      </PageHeader>

      <GroupingCreateWizard
        materials={materials}
        initialBasics={toBasics(item)}
        initialLines={toDraftLines(item)}
        onCancel={handleCancel}
        onSave={handleSave}
        isSubmitting={isSubmitting}
      />
    </PageRoot>
  );
}
