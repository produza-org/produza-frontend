import { NEED_LINE_CATEGORIES } from '@/features/production-orders/constants';
import type {
  NeedLineCategory,
  ProductionOrderNeedLine,
} from '@/features/production-orders/types/production-order';

export type NeedLineCategoryGroup = {
  category: NeedLineCategory;
  lines: ProductionOrderNeedLine[];
};

export function groupNeedLinesByCategory(
  lines: ProductionOrderNeedLine[]
): NeedLineCategoryGroup[] {
  return NEED_LINE_CATEGORIES.map((category) => ({
    category,
    lines: lines
      .filter((line) => line.category === category)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}
