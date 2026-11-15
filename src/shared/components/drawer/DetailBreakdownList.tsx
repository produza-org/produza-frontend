import type { ReactNode } from 'react';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import {
  BreakdownDot,
  BreakdownList,
  BreakdownPrimary,
  BreakdownRow,
  BreakdownRowEnd,
  BreakdownRowStart,
  BreakdownSecondary,
  BreakdownSection,
  BreakdownSectionTitle,
  BreakdownValue,
  BreakdownValueSecondary,
} from './EntityDetailDrawer.styled';

export type DetailBreakdownItem = {
  id: string;
  primary: string;
  secondary?: string;
  value: ReactNode;
  valueSecondary?: ReactNode;
};

type DetailBreakdownListProps = {
  title: string;
  items: DetailBreakdownItem[];
  showIcon?: boolean;
};

export function DetailBreakdownList({
  title,
  items,
  showIcon = true,
}: DetailBreakdownListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <BreakdownSection>
      <BreakdownSectionTitle component="h3">
        {showIcon ? <Inventory2Outlined sx={{ fontSize: '1rem' }} /> : null}
        {title}
      </BreakdownSectionTitle>
      <BreakdownList>
        {items.map((item) => (
          <BreakdownRow key={item.id}>
            <BreakdownRowStart>
              <BreakdownDot />
              <div>
                <BreakdownPrimary>{item.primary}</BreakdownPrimary>
                {item.secondary ? (
                  <BreakdownSecondary>{item.secondary}</BreakdownSecondary>
                ) : null}
              </div>
            </BreakdownRowStart>
            <BreakdownRowEnd>
              <BreakdownValue component="div">{item.value}</BreakdownValue>
              {item.valueSecondary != null ? (
                <BreakdownValueSecondary component="div">
                  {item.valueSecondary}
                </BreakdownValueSecondary>
              ) : null}
            </BreakdownRowEnd>
          </BreakdownRow>
        ))}
      </BreakdownList>
    </BreakdownSection>
  );
}
