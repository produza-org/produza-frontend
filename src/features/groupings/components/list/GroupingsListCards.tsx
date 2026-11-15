import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { ActionsMenu, type ActionsMenuItem } from '@/shared/components/actions';
import { GroupingsCardsFooter } from '@/features/groupings/components/list/GroupingsCardsFooter';
import type { RawMaterialGroup } from '@/features/groupings/types/grouping';
import { formatCurrencyBrl } from '@/features/groupings/utils/format';
import {
  CardsGrid,
  EmptyState,
  GroupCard,
  GroupCardAccent,
  GroupCardBody,
  GroupCardCode,
  GroupCardHeader,
  GroupCardStat,
  GroupCardStatLabel,
  GroupCardStatValue,
  GroupCardStats,
  GroupCardTitle,
} from '@/features/groupings/components/list/GroupingsListCards.styled';

type GroupingsListCardsProps = {
  rows: RawMaterialGroup[];
  shown: number;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
  onDeleteRequest: (id: string) => void;
  onCardClick: (item: RawMaterialGroup) => void;
};

export function GroupingsListCards({
  rows,
  shown,
  total,
  page,
  totalPages,
  onPageChange,
  canPrev,
  canNext,
  onDeleteRequest,
  onCardClick,
}: GroupingsListCardsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (rows.length === 0) {
    return <EmptyState>{t('groupings.cards.empty')}</EmptyState>;
  }

  return (
    <>
      <CardsGrid>
        {rows.map((row) => {
          const actionItems: ActionsMenuItem[] = [
            {
              id: 'edit',
              label: t('groupings.cards.editAction'),
              icon: <EditOutlined sx={{ fontSize: 18 }} />,
              onClick: () => navigate(`/groupings/${row.id}/edit`),
            },
            {
              id: 'delete',
              label: t('groupings.cards.deleteAction'),
              icon: <DeleteOutline sx={{ fontSize: 18 }} />,
              tone: 'danger',
              onClick: () => onDeleteRequest(row.id),
            },
          ];

          return (
            <GroupCard
              key={row.id}
              role="button"
              tabIndex={0}
              onClick={() => onCardClick(row)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onCardClick(row);
                }
              }}
            >
              <GroupCardAccent />
              <GroupCardBody>
                <GroupCardHeader>
                  <div>
                    <GroupCardCode>
                      {t('groupings.cards.codeLabel', { code: row.code })}
                    </GroupCardCode>
                    <GroupCardTitle>{row.name}</GroupCardTitle>
                  </div>
                  <ActionsMenu
                    ariaLabel={t('groupings.cards.actionsMenuAria')}
                    items={actionItems}
                  />
                </GroupCardHeader>
                <GroupCardStats>
                  <GroupCardStat>
                    <GroupCardStatLabel>
                      {t('groupings.cards.materialsLabel')}
                    </GroupCardStatLabel>
                    <GroupCardStatValue>{row.materialsCount}</GroupCardStatValue>
                  </GroupCardStat>
                  <GroupCardStat>
                    <GroupCardStatLabel>
                      {t('groupings.cards.costLabel')}
                    </GroupCardStatLabel>
                    <GroupCardStatValue>
                      {formatCurrencyBrl(row.totalCost)}
                    </GroupCardStatValue>
                  </GroupCardStat>
                </GroupCardStats>
              </GroupCardBody>
            </GroupCard>
          );
        })}
      </CardsGrid>
      <GroupingsCardsFooter
        shown={shown}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        canPrev={canPrev}
        canNext={canNext}
      />
    </>
  );
}
