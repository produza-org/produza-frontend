import { useTranslation } from 'react-i18next';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {
  FooterBar,
  FooterSummary,
  PageNumberActive,
  PageNumberButton,
  PagerEllipsis,
  PagerIconButton,
  PagerRow,
} from '@/features/production-orders/components/list/ProductionOrdersListTable.styled';
import { getPageNumbers } from '@/features/production-orders/utils/list/production-orders-list';

type ProductionOrdersTableFooterProps = {
  shown: number;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
};

export function ProductionOrdersTableFooter({
  shown,
  total,
  page,
  totalPages,
  onPageChange,
  canPrev,
  canNext,
}: ProductionOrdersTableFooterProps) {
  const { t } = useTranslation();
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <FooterBar>
      <FooterSummary>
        {t('productionOrders.table.pagerSummary', { shown, total })}
      </FooterSummary>
      <PagerRow>
        <PagerIconButton
          size="small"
          disabled={!canPrev}
          aria-label={t('productionOrders.table.pagerPrev')}
          onClick={() => onPageChange(page - 1)}
        >
          <KeyboardArrowLeft />
        </PagerIconButton>
        {pageNumbers.map((item, index) =>
          item === 'ellipsis' ? (
            <PagerEllipsis key={`ellipsis-${index}`}>...</PagerEllipsis>
          ) : item === page ? (
            <PageNumberActive key={item}>{item}</PageNumberActive>
          ) : (
            <PageNumberButton
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
            >
              {item}
            </PageNumberButton>
          )
        )}
        <PagerIconButton
          size="small"
          disabled={!canNext}
          aria-label={t('productionOrders.table.pagerNext')}
          onClick={() => onPageChange(page + 1)}
        >
          <KeyboardArrowRight />
        </PagerIconButton>
      </PagerRow>
    </FooterBar>
  );
}
