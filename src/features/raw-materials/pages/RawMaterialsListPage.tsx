import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddOutlined from '@mui/icons-material/AddOutlined';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { RawMaterialsStatCard } from '@/features/raw-materials/components/RawMaterialsStatCard';
import { RawMaterialsListFilters } from '@/features/raw-materials/components/RawMaterialsListFilters';
import { RawMaterialsListTable } from '@/features/raw-materials/components/RawMaterialsListTable';
import { useFilteredRawMaterials } from '@/features/raw-materials/hooks/useFilteredRawMaterials';
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
  const [nameFilter, setNameFilter] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const filteredRows = useFilteredRawMaterials(nameFilter, codeFilter);

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
          value="124"
        />
        <RawMaterialsStatCard
          accentColor={p.tertiaryFixedDim}
          label={t('rawMaterials.list.statCost')}
          value="R$ 15.420,50"
        />
        <RawMaterialsStatCard
          accentColor={p.secondary}
          label={t('rawMaterials.list.statActive')}
          value="98%"
        />
        <RawMaterialsStatCard
          accentColor={p.error}
          label={t('rawMaterials.list.statCritical')}
          value="03"
          valueErrorTone
        />
      </StatsGrid>

      <RawMaterialsListFilters
        nameFilter={nameFilter}
        codeFilter={codeFilter}
        onNameFilterChange={setNameFilter}
        onCodeFilterChange={setCodeFilter}
      />

      <RawMaterialsListTable rows={filteredRows} />
    </PageRoot>
  );
}
