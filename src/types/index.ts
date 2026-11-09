export interface Specification {
  key: string;
  value: string;
}

export type ProductStatus = 'published' | 'unpublished' | 'hidden';
export type RestockStatus = 'available' | 'restocking_soon' | 'coming_soon';
export type ProductColor = 'Blue' | 'White' | 'Orange';

export interface ProductVariant {
  id: string;
  color: ProductColor;
  name: string;
  sku: string;
  image: string;
  stock: number;
  hexColor: string;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  slogan?: string;
  description: string;
  longDescription?: string;
  images: string[];
  category: string;
  sku: string;
  price: number; // in NPR
  discountedPrice?: number; // in NPR
  stock: number;
  variants: ProductVariant[];
  lowStockThreshold: number;
  specifications: Specification[];
  status: ProductStatus;
  isFeatured: boolean;
  isBestseller: boolean;
  restockStatus: RestockStatus;
  expectedRestockDate?: string;
  incomingStock?: number;
  restockAnnouncement?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: 'manual_adjustment' | 'order_deduction' | 'order_cancellation' | 'restock' | 'return';
  referenceId?: string;
  operator?: string;
  createdAt: string;
}

export type DiscountType = 'percentage' | 'fixed';

export interface Deal {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  productIds: string[];
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxRedemptions?: number;
  timesRedeemed: number;
  couponCode?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LimitedOffer {
  id: string;
  title: string;
  productId: string;
  specialPrice: number;
  originalPrice: number;
  totalOfferStock: number;
  soldStock: number;
  startTime: string;
  endTime: string;
  maxPerCustomer: number;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  altPhone?: string;
  province: string;
  district: string;
  cityMunicipality: string;
  areaTole: string;
  fullAddress: string;
  houseNumber: string;
  landmark?: string;
  instructions?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  color?: ProductColor;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery' | 'eSewa';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED' | 'PENDING_VERIFICATION';

export interface Order {
  id: string;
  customer: CustomerAddress;
  items: OrderItem[];
  selectedColor?: ProductColor;
  subtotal: number;
  dealDiscount: number;
  couponDiscount: number;
  appliedCoupon?: string;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  esewaNumber?: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreEvent {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  code: string; // e.g. "CLEVARA-GALA" or "WELCOME2026"
  congratulationMessage: string;
  rewardTitle: string;
  rewardCode: string; // e.g. "VIPGALA20"
  rewardDiscountValue: number;
  rewardDiscountType: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  isActive: boolean;
  attendeesCount: number;
  createdAt: string;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerContact: string;
  checkedInAt: string;
}

export interface RestockSubscription {
  id: string;
  productId: string;
  productName: string;
  contact: string; // phone or email
  createdAt: string;
  notified: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  currencySymbol: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  defaultLowStockThreshold: number;
  passwordHash: string;
  passwordSalt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface EsewaConfig {
  merchantId: string;
  secretKey: string;
  environment: 'development' | 'production';
  successUrl: string;
  failureUrl: string;
}
