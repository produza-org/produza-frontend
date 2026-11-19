export type DashboardGrain = 'day' | 'week' | 'month';

export type DashboardPeriodPreset = 'day' | 'week' | 'month' | 'custom';

export type DashboardSummaryParams = {
  from: string;
  to: string;
  grain: DashboardGrain;
  topN?: number;
};

export type DashboardKpis = {
  ordersIssued: number;
  actualProduced: number;
  avgFulfillment: number | null;
  materialsBelowMin: number;
  productsWithRecipe: number;
  productsWithoutRecipe: number;
};

export type ProductionVolumePoint = {
  bucket: string;
  actualProduced: number;
  plannedQuantity: number;
};

export type PlannedVsActualTotals = {
  plannedQuantity: number;
  actualProduced: number;
  netVariation: number;
};

export type OutputByProductItem = {
  productId: string;
  productName: string;
  actualProduced: number;
  plannedQuantity: number;
};

export type OutputByProductSummary = {
  items: OutputByProductItem[];
  usedPlannedFallback: boolean;
};

export type OrdersIssuedPoint = {
  bucket: string;
  total: number;
  withActual: number;
  withoutActual: number;
};

export type StockHealthSummary = {
  belowMin: number;
  outOfStock: number;
  ok: number;
  inventoryValue: number;
};

export type MaterialDemandItem = {
  rawMaterialId: string;
  code: string;
  name: string;
  unit: string;
  quantity: number;
};

export type MaterialDemandSummary = {
  items: MaterialDemandItem[];
};

export type DashboardSummary = {
  period: {
    from: string;
    to: string;
    grain: DashboardGrain;
  };
  kpis: DashboardKpis;
  productionVolume: ProductionVolumePoint[];
  plannedVsActual: PlannedVsActualTotals;
  outputByProduct: OutputByProductSummary;
  ordersIssued: OrdersIssuedPoint[];
  stockHealth: StockHealthSummary;
  materialDemand: MaterialDemandSummary;
};
