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
} from '@/features/raw-materials/components/RawMaterialsListTable.styled';

type RawMaterialsTableFooterProps = {
  shown: number;
  total: number;
};

export function RawMaterialsTableFooter({ shown, total }: RawMaterialsTableFooterProps) {
  const { t } = useTranslation();

  return (
    <FooterBar>
      <FooterSummary>{t('rawMaterials.table.pagerSummary', { shown, total })}</FooterSummary>
      <PagerRow>
        <PagerIconButton size="small" disabled aria-label={t('rawMaterials.table.pagerPrev')}>
          <KeyboardArrowLeft />
        </PagerIconButton>
        <PageNumberActive>1</PageNumberActive>
        <PageNumberButton type="button">2</PageNumberButton>
        <PageNumberButton type="button">3</PageNumberButton>
        <PagerEllipsis>...</PagerEllipsis>
        <PageNumberButton type="button">21</PageNumberButton>
        <PagerIconButton size="small" aria-label={t('rawMaterials.table.pagerNext')}>
          <KeyboardArrowRight />
        </PagerIconButton>
      </PagerRow>
    </FooterBar>
  );
}
