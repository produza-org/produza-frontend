import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddOutlined from '@mui/icons-material/AddOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { PageSubtitle, PageTitle } from '@/shared/components/page';
import { ProductionOrdersListFilters } from '@/features/production-orders/components/list/ProductionOrdersListFilters';
import { ProductionOrdersListTable } from '@/features/production-orders/components/list/ProductionOrdersListTable';
import { ProductionOrdersStatCard } from '@/features/production-orders/components/list/ProductionOrdersStatCard';
import { useProductionOrdersContext } from '@/features/production-orders/context/ProductionOrdersContext';
import { useProductionOrdersFilters } from '@/features/production-orders/hooks/useProductionOrdersFilters';
import { useProductionOrdersList } from '@/features/production-orders/hooks/useProductionOrdersList';
import { useProductionOrdersStats } from '@/features/production-orders/hooks/useProductionOrdersStats';
import {
  formatDecimal,
  formatQuantity,
} from '@/features/production-orders/utils/format';
import {
  AddOrderButton,
  HeroRow,
  PageRoot,
  StatsGrid,
} from '@/features/production-orders/pages/list/ProductionOrdersListPage.styled';

export function ProductionOrdersListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const p = theme.palette.produza;
  const { isLoading, errorMessage } = useProductionOrdersContext();
  const { numberFilter, setNumberFilter } = useProductionOrdersFilters();
  const { rows, page, totalFiltered, totalPages, setPage, canPrev, canNext } =
    useProductionOrdersList();
  const { totalCount, totalMisturaSum, averageQ } = useProductionOrdersStats();

  const loadError =
    errorMessage === 'UNEXPECTED'
      ? t('productionOrders.errors.unexpected')
      : errorMessage;

  return (
    <PageRoot>
      <HeroRow>
        <Box>
          <PageTitle>{t('productionOrders.list.title')}</PageTitle>
          <PageSubtitle>{t('productionOrders.list.subtitle')}</PageSubtitle>
        </Box>
        <AddOrderButton
          variant="contained"
          disableElevation
          startIcon={<AddOutlined />}
          aria-label={t('productionOrders.list.addAria')}
          onClick={() => navigate('/production-orders/new')}
        >
          {t('productionOrders.list.add')}
        </AddOrderButton>
      </HeroRow>

      {loadError ? (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      ) : null}

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <CircularProgress
            size={32}
            aria-label={t('productionOrders.list.loading')}
          />
        </Box>
      ) : (
        <>
          <StatsGrid>
            <ProductionOrdersStatCard
              accentColor={p.primary}
              label={t('productionOrders.list.statTotal')}
              value={String(totalCount)}
            />
            <ProductionOrdersStatCard
              accentColor={p.secondary}
              label={t('productionOrders.list.statAvgQ')}
              value={formatQuantity(averageQ)}
            />
            <ProductionOrdersStatCard
              accentColor={p.tertiaryFixedDim}
              label={t('productionOrders.list.statTotalMistura')}
              value={formatDecimal(totalMisturaSum, 4)}
            />
          </StatsGrid>

          <ProductionOrdersListFilters
            numberFilter={numberFilter}
            onNumberFilterChange={setNumberFilter}
          />

          <ProductionOrdersListTable
            rows={rows}
            shown={rows.length}
            total={totalFiltered}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            canPrev={canPrev}
            canNext={canNext}
          />
        </>
      )}
    </PageRoot>
  );
}
