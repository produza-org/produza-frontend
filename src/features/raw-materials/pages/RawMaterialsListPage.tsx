import { useTranslation } from 'react-i18next';
import AddOutlined from '@mui/icons-material/AddOutlined';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { RawMaterialsStatCard } from '@/features/raw-materials/components/RawMaterialsStatCard';
import { RawMaterialsListFilters } from '@/features/raw-materials/components/RawMaterialsListFilters';
import { RawMaterialsListTable } from '@/features/raw-materials/components/RawMaterialsListTable';
import { formatCurrencyBrl } from '@/features/raw-materials/format';
import { useRawMaterialsFilters } from '@/features/raw-materials/hooks/useRawMaterialsFilters';
import { useRawMaterialsList } from '@/features/raw-materials/hooks/useRawMaterialsList';
import { useRawMaterialsStats } from '@/features/raw-materials/hooks/useRawMaterialsStats';
import {
  AddMaterialButton,
  HeroRow,
  PageRoot,
  PageSubtitle,
  PageTitle,
  StatsGrid,
} from '@/features/raw-materials/pages/RawMaterialsListPage.styled';

export function RawMaterialsListPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const p = theme.palette.produza;
  const { nameFilter, codeFilter, setNameFilter, setCodeFilter } = useRawMaterialsFilters();
  const { rows, page, totalFiltered, totalPages, setPage, canPrev, canNext } =
    useRawMaterialsList();
  const { totalCount, totalCost, activePercent, criticalCount } = useRawMaterialsStats();

  return (
    <PageRoot>
      <HeroRow>
        <Box>
          <PageTitle>{t('rawMaterials.list.title')}</PageTitle>
          <PageSubtitle>{t('rawMaterials.list.subtitle')}</PageSubtitle>
        </Box>
        <AddMaterialButton
          variant="contained"
          disableElevation
          startIcon={<AddOutlined />}
          aria-label={t('rawMaterials.list.addAria')}
        >
          {t('rawMaterials.list.add')}
        </AddMaterialButton>
      </HeroRow>

      <StatsGrid>
        <RawMaterialsStatCard
          accentColor={p.primary}
          label={t('rawMaterials.list.statTotal')}
          value={String(totalCount)}
        />
        <RawMaterialsStatCard
          accentColor={p.tertiaryFixedDim}
          label={t('rawMaterials.list.statCost')}
          value={formatCurrencyBrl(totalCost)}
        />
        <RawMaterialsStatCard
          accentColor={p.secondary}
          label={t('rawMaterials.list.statActive')}
          value={`${activePercent}%`}
        />
        <RawMaterialsStatCard
          accentColor={p.error}
          label={t('rawMaterials.list.statCritical')}
          value={String(criticalCount).padStart(2, '0')}
          valueErrorTone
        />
      </StatsGrid>

      <RawMaterialsListFilters
        nameFilter={nameFilter}
        codeFilter={codeFilter}
        onNameFilterChange={setNameFilter}
        onCodeFilterChange={setCodeFilter}
      />

      <RawMaterialsListTable
        rows={rows}
        shown={rows.length}
        total={totalFiltered}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        canPrev={canPrev}
        canNext={canNext}
      />
    </PageRoot>
  );
}
