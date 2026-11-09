/**
 * NPR (Nepalese Rupee) pricing calculations and formatting.
 * Consistently renders 'रु. 1,500' across the entire platform.
 */

export function formatNPR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'रु. 0';
  }
  const cleanNumber = Math.max(0, Math.round(amount));
  // Format with standard South Asian / Nepali grouping (lakhs/crores)
  const formatted = cleanNumber.toLocaleString('en-IN');
  return `रु. ${formatted}`;
}

export interface CalculateOrderTotalsParams {
  items: Array<{ unitPrice: number; quantity: number }>;
  dealDiscount?: number;
  couponDiscount?: number;
  deliveryFee?: number;
  freeDeliveryThreshold?: number;
}

export interface OrderTotals {
  subtotal: number;
  dealDiscount: number;
  couponDiscount: number;
  deliveryFee: number;
  total: number;
}

export function calculateOrderTotals(params: CalculateOrderTotalsParams): OrderTotals {
  const subtotal = params.items.reduce((sum, item) => {
    const price = Math.max(0, item.unitPrice || 0);
    const qty = Math.max(0, item.quantity || 0);
    return sum + price * qty;
  }, 0);

  const dealDiscount = Math.max(0, Math.min(subtotal, params.dealDiscount || 0));
  const remainingAfterDeal = subtotal - dealDiscount;
  const couponDiscount = Math.max(0, Math.min(remainingAfterDeal, params.couponDiscount || 0));

  const freeThreshold = params.freeDeliveryThreshold ?? 3000;
  const defaultFee = params.deliveryFee ?? 150;

  // Free delivery if order subtotal reaches free threshold
  const deliveryFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : defaultFee;

  const total = Math.max(0, subtotal - dealDiscount - couponDiscount + deliveryFee);

  return {
    subtotal,
    dealDiscount,
    couponDiscount,
    deliveryFee,
    total,
  };
}

export function calculateDiscountPercentage(originalPrice: number, discountedPrice?: number): number {
  if (!discountedPrice || discountedPrice >= originalPrice || originalPrice <= 0) {
    return 0;
  }
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}
