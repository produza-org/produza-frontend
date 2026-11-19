import type { ReactNode } from 'react';
import {
  DetailFactLabel,
  DetailFactRow,
  DetailFactValue,
  DetailFacts,
  DetailSection,
  DetailSectionTitle,
} from './EntityDetailDrawer.styled';

export type DetailFactItem = {
  id: string;
  label: string;
  value: ReactNode;
};

type DetailFactListProps = {
  title?: string;
  items: DetailFactItem[];
  style?: React.CSSProperties;
};

export function DetailFactList({ title, items, style }: DetailFactListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <DetailSection style={style}>
      {title ? (
        <DetailSectionTitle component="h3">{title}</DetailSectionTitle>
      ) : null}
      <DetailFacts>
        {items.map((item) => (
          <DetailFactRow key={item.id}>
            <DetailFactLabel>{item.label}</DetailFactLabel>
            <DetailFactValue component="div">{item.value}</DetailFactValue>
          </DetailFactRow>
        ))}
      </DetailFacts>
    </DetailSection>
  );
}
