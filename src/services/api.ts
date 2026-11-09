import { Product, Deal, LimitedOffer, Order, StoreSettings, InventoryLog, RestockSubscription, StoreEvent, EventAttendee } from '../types';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('clevara_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public APIs
  async getSettings(): Promise<Partial<StoreSettings>> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch store settings');
    return res.json();
  },

  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async getDeals(): Promise<Deal[]> {
    const res = await fetch('/api/deals');
    if (!res.ok) throw new Error('Failed to fetch deals');
    return res.json();
  },

  async getLimitedOffers(): Promise<LimitedOffer[]> {
    const res = await fetch('/api/limited-offers');
    if (!res.ok) throw new Error('Failed to fetch limited offers');
    return res.json();
  },

  async getEvents(): Promise<StoreEvent[]> {
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async checkInEvent(data: { eventId: string; customerName: string; customerContact: string }): Promise<{
    success: boolean;
    congratulationTitle: string;
    congratulationMessage: string;
    eventTitle: string;
    rewardTitle: string;
    rewardCode: string;
    rewardDiscountValue: number;
    rewardDiscountType: 'percentage' | 'fixed';
    attendee: EventAttendee;
  }> {
    const res = await fetch('/api/events/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to check in to event');
    return resData;
  },

  async createOrder(orderData: any): Promise<{ success: boolean; orderId: string; order: Order }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },

  async subscribeRestock(productId: string, contact: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/restock/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, contact }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
    return data;
  },

  async initiateEsewaPayment(orderId: string): Promise<any> {
    const res = await fetch('/api/payment/esewa/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to initiate eSewa payment');
    return data;
  },

  async verifyEsewaPayment(orderId: string, transactionRef?: string, status?: string): Promise<any> {
    const res = await fetch('/api/payment/esewa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, transactionRef, status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to verify eSewa payment');
    return data;
  },

  // Owner Auth APIs
  async login(password: string): Promise<{ token: string; storeName: string; expiresAt: number }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    localStorage.removeItem('clevara_admin_token');
  },

  async verifyAuth(): Promise<{ authenticated: boolean; storeName?: string }> {
    const res = await fetch('/api/auth/verify', {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) return { authenticated: false };
    return res.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  // Owner Admin APIs
  async adminGetProducts(): Promise<Product[]> {
    const res = await fetch('/api/admin/products', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminCreateProduct(productData: any): Promise<Product> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data;
  },

  async adminUpdateProduct(id: string, productData: any): Promise<Product> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async adminDeleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  async adminDuplicateProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/admin/products/${id}/duplicate`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to duplicate product');
    return data;
  },

  async adminAdjustInventory(adjustment: { productId: string; variantId?: string; color?: string; type: 'set' | 'add' | 'remove'; amount: number; reason?: string }): Promise<any> {
    const res = await fetch('/api/admin/inventory/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(adjustment),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to adjust stock');
    return data;
  },

  async adminUpdateVariant(productId: string, variantId: string, data: { stock?: number; image?: string; name?: string; isAvailable?: boolean }): Promise<any> {
    const res = await fetch(`/api/admin/products/${productId}/variants/${variantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to update variant');
    return resData;
  },

  async adminGetInventoryLogs(): Promise<InventoryLog[]> {
    const res = await fetch('/api/admin/inventory/logs', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminGetOrders(params?: { search?: string; status?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    const res = await fetch(`/api/admin/orders?${query.toString()}`, { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminUpdateOrderStatus(orderId: string, status: string): Promise<Order> {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
    return data;
  },

  async adminGetCustomers(): Promise<any[]> {
    const res = await fetch('/api/admin/customers', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminGetDeals(): Promise<Deal[]> {
    const res = await fetch('/api/admin/deals', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminCreateDeal(deal: any): Promise<Deal> {
    const res = await fetch('/api/admin/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(deal),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create deal');
    return data;
  },

  async adminUpdateDeal(id: string, deal: any): Promise<Deal> {
    const res = await fetch(`/api/admin/deals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(deal),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update deal');
    return data;
  },

  async adminDeleteDeal(id: string): Promise<void> {
    const res = await fetch(`/api/admin/deals/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete deal');
  },

  // Owner Events APIs
  async adminGetEvents(): Promise<StoreEvent[]> {
    const res = await fetch('/api/admin/events', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminCreateEvent(event: any): Promise<StoreEvent> {
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(event),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create event');
    return data;
  },

  async adminUpdateEvent(id: string, event: any): Promise<StoreEvent> {
    const res = await fetch(`/api/admin/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(event),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update event');
    return data;
  },

  async adminDeleteEvent(id: string): Promise<void> {
    const res = await fetch(`/api/admin/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete event');
  },

  async adminGetEventAttendees(): Promise<EventAttendee[]> {
    const res = await fetch('/api/admin/events/attendees', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminGetLimitedOffers(): Promise<LimitedOffer[]> {
    const res = await fetch('/api/admin/limited-offers', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminCreateLimitedOffer(offer: any): Promise<LimitedOffer> {
    const res = await fetch('/api/admin/limited-offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(offer),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create offer');
    return data;
  },

  async adminUpdateLimitedOffer(id: string, offer: any): Promise<LimitedOffer> {
    const res = await fetch(`/api/admin/limited-offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(offer),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update offer');
    return data;
  },

  async adminDeleteLimitedOffer(id: string): Promise<void> {
    const res = await fetch(`/api/admin/limited-offers/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete offer');
  },

  async adminGetAnalytics(): Promise<any> {
    const res = await fetch('/api/admin/analytics', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminGetRestockSubscribers(): Promise<RestockSubscription[]> {
    const res = await fetch('/api/admin/restock/subscribers', { headers: { ...getAuthHeader() } });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async adminNotifyRestock(productId: string): Promise<{ success: boolean; count: number }> {
    const res = await fetch('/api/admin/restock/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to notify');
    return data;
  },

  async adminUpdateSettings(settings: any): Promise<any> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },

  async adminResetDatabase(): Promise<any> {
    const res = await fetch('/api/admin/database/reset', {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset store');
    return data;
  },

  async adminSeed25Products(): Promise<any> {
    const res = await fetch('/api/admin/database/seed-25', {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to seed products');
    return data;
  },
};
