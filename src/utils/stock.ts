/**
 * Automatic Stock Tag System according to CLEVARA Specification:
 * - 1 unit: "Only 1 left!"
 * - 2 units: "Only 2 left!"
 * - 3 units: "Only 3 left!"
 * - 4–10 units: "Only X left!"
 * - Stock <= lowStockThreshold: "Limited Stock"
 * - 0 units: "Out of Stock" (or "Restocking Soon" / "Coming Soon" if configured)
 */

export interface StockTagInfo {
  label: string;
  isOrderable: boolean;
  severity: 'critical' | 'warning' | 'info' | 'out_of_stock' | 'normal';
}

export function getStockTag(product: {
  stock: number;
  lowStockThreshold?: number;
  restockStatus?: 'available' | 'restocking_soon' | 'coming_soon';
}): StockTagInfo {
  const stock = Math.max(0, product.stock ?? 0);
  const status = product.restockStatus || 'available';

  if (status === 'coming_soon') {
    return {
      label: 'Coming Soon',
      isOrderable: false,
      severity: 'info',
    };
  }

  if (status === 'restocking_soon') {
    return {
      label: 'Restocking Soon',
      isOrderable: false,
      severity: 'info',
    };
  }

  if (stock === 0) {
    return {
      label: 'Sold Out',
      isOrderable: false,
      severity: 'out_of_stock',
    };
  }

  if (stock >= 1 && stock <= 3) {
    return {
      label: `Only ${stock} Left!`,
      isOrderable: true,
      severity: 'critical',
    };
  }

  if (stock >= 4 && stock <= 9) {
    return {
      label: 'Limited Stock',
      isOrderable: true,
      severity: 'warning',
    };
  }

  return {
    label: 'In Stock',
    isOrderable: true,
    severity: 'normal',
  };
}
