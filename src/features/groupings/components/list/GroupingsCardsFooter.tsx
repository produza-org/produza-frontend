import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { getPageNumbers } from '@/features/groupings/utils/list/groupings-list';
import {
  FooterRoot,
  FooterSummary,
  PagerButton,
  PagerIconButton,
  PagerRow,
} from '@/features/groupings/components/list/GroupingsListCards.styled';

type GroupingsCardsFooterProps = {
  shown: number;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
};

export function GroupingsCardsFooter({
  shown,
  total,
  page,
  totalPages,
  onPageChange,
  canPrev,
  canNext,
}: GroupingsCardsFooterProps) {
  const { t } = useTranslation();
  const pages = getPageNumbers(page, totalPages);

  return (
    <FooterRoot>
      <FooterSummary>
        {t('groupings.cards.pagerSummary', { shown, total })}
      </FooterSummary>
      <PagerRow>
        <PagerIconButton
          size="small"
          aria-label={t('groupings.cards.pagerPrev')}
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft fontSize="small" />
        </PagerIconButton>
        {pages.map((entry, index) =>
          entry === 'ellipsis' ? (
            <FooterSummary key={`ellipsis-${index}`}>…</FooterSummary>
          ) : (
            <PagerButton
              key={entry}
              size="small"
              variant={entry === page ? 'contained' : 'outlined'}
              disableElevation
              onClick={() => onPageChange(entry)}
              sx={
                entry === page
                  ? {
                      backgroundColor: 'produza.primary',
                      color: 'produza.onPrimary',
                      borderColor: 'produza.primary',
                      '&:hover': {
                        backgroundColor: 'produza.primaryContainer',
                      },
                    }
                  : undefined
              }
            >
              {entry}
            </PagerButton>
          )
        )}
        <PagerIconButton
          size="small"
          aria-label={t('groupings.cards.pagerNext')}
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight fontSize="small" />
        </PagerIconButton>
      </PagerRow>
    </FooterRoot>
  );
}
