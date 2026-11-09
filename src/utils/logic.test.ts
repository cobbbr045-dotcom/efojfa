import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNPR, calculateOrderTotals, calculateDiscountPercentage } from './pricing';
import { getStockTag } from './stock';
import { validateNepalPhone, validateCustomerAddress } from './validation';

test('NPR formatting outputs standard currency prefix and grouping', () => {
  assert.equal(formatNPR(1500), 'रु. 1,500');
  assert.equal(formatNPR(0), 'रु. 0');
  assert.equal(formatNPR(125000), 'रु. 1,25,000');
});

test('calculateOrderTotals applies discounts and free delivery thresholds correctly', () => {
  const result1 = calculateOrderTotals({
    items: [
      { unitPrice: 1450, quantity: 1 },
      { unitPrice: 500, quantity: 1 },
    ],
    deliveryFee: 150,
    freeDeliveryThreshold: 3000,
  });

  assert.equal(result1.subtotal, 1950);
  assert.equal(result1.deliveryFee, 150);
  assert.equal(result1.total, 2100);

  // Over free delivery threshold (3000)
  const result2 = calculateOrderTotals({
    items: [{ unitPrice: 3500, quantity: 1 }],
    deliveryFee: 150,
    freeDeliveryThreshold: 3000,
  });

  assert.equal(result2.subtotal, 3500);
  assert.equal(result2.deliveryFee, 0); // Free delivery
  assert.equal(result2.total, 3500);

  // With coupon discount
  const result3 = calculateOrderTotals({
    items: [{ unitPrice: 2000, quantity: 2 }], // 4000
    couponDiscount: 500,
    deliveryFee: 150,
    freeDeliveryThreshold: 3000,
  });

  assert.equal(result3.subtotal, 4000);
  assert.equal(result3.couponDiscount, 500);
  assert.equal(result3.deliveryFee, 0);
  assert.equal(result3.total, 3500);
});

test('calculateDiscountPercentage calculates correct markdown', () => {
  assert.equal(calculateDiscountPercentage(2000, 1500), 25);
  assert.equal(calculateDiscountPercentage(1000, 1000), 0);
  assert.equal(calculateDiscountPercentage(1000, 1200), 0);
});

test('getStockTag implements CLEVARA exact stock tag rules', () => {
  assert.equal(getStockTag({ stock: 1 }).label, 'Only 1 Left!');
  assert.equal(getStockTag({ stock: 2 }).label, 'Only 2 Left!');
  assert.equal(getStockTag({ stock: 3 }).label, 'Only 3 Left!');
  assert.equal(getStockTag({ stock: 4 }).label, 'Limited Stock');
  assert.equal(getStockTag({ stock: 7 }).label, 'Limited Stock');
  assert.equal(getStockTag({ stock: 9 }).label, 'Limited Stock');
  assert.equal(getStockTag({ stock: 10 }).label, 'In Stock');
  assert.equal(getStockTag({ stock: 25 }).label, 'In Stock');
  assert.equal(getStockTag({ stock: 0 }).label, 'Sold Out');
  assert.equal(getStockTag({ stock: 0, restockStatus: 'restocking_soon' }).label, 'Restocking Soon');
  assert.equal(getStockTag({ stock: 0, restockStatus: 'coming_soon' }).label, 'Coming Soon');
});

test('validateNepalPhone correctly validates Nepalese phone numbers', () => {
  const validMobile1 = validateNepalPhone('9841234567');
  assert.equal(validMobile1.isValid, true);

  const validMobile2 = validateNepalPhone('+977 9801234567');
  assert.equal(validMobile2.isValid, true);

  const invalidShort = validateNepalPhone('984123');
  assert.equal(invalidShort.isValid, false);

  const invalidPrefix = validateNepalPhone('1234567890');
  assert.equal(invalidPrefix.isValid, false);
});

test('validateCustomerAddress validates required checkout fields', () => {
  const invalid = validateCustomerAddress({});
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.province);
  assert.ok(invalid.errors.district);
  assert.ok(invalid.errors.houseNumber);

  const valid = validateCustomerAddress({
    fullName: 'Aayush Shrestha',
    phone: '9841987654',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    cityMunicipality: 'Kathmandu Metropolitan',
    areaTole: 'Baluwatar',
    fullAddress: 'Ward 4, Near Russian Embassy',
    houseNumber: 'House 14B',
  });
  assert.equal(valid.isValid, true);
});

test('calculateOrderTotals handles percentage discount from event reward vouchers', () => {
  const result = calculateOrderTotals({
    items: [{ unitPrice: 3000, quantity: 1 }],
    couponDiscount: Math.round(3000 * 0.2), // 20% event reward VIP pass
    deliveryFee: 150,
    freeDeliveryThreshold: 3000,
  });

  assert.equal(result.subtotal, 3000);
  assert.equal(result.couponDiscount, 600);
  assert.equal(result.deliveryFee, 0); // Free delivery since subtotal >= 3000
  assert.equal(result.total, 2400);
});
