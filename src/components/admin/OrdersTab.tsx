import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { formatNPR } from '../../utils/pricing';
import { api } from '../../services/api';
import { Phone, MessageSquare, Search, Filter, MapPin, CheckCircle, Package, Truck, AlertCircle, Banknote } from 'lucide-react';

interface OrdersTabProps {
  orders: Order[];
  onRefresh: () => Promise<void>;
}

const STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [colorFilter, setColorFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.customer.cityMunicipality.toLowerCase().includes(q) ||
      (o.selectedColor && o.selectedColor.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesColor = colorFilter === 'All' || o.selectedColor === colorFilter;

    return matchesSearch && matchesStatus && matchesColor;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.adminUpdateOrderStatus(orderId, newStatus);
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getCleanNepalPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('977')) return digits;
    if (digits.length === 10) return `977${digits}`;
    return digits;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Orders & Nepalese Courier Dispatch
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-medium">CLEVARA Fulfillment</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            Customer Orders & Colour Allocation
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Review ordered colour variants (Blue, White, Orange), payment methods (eSewa / COD), and manage status. Cancelling an order automatically restores variant inventory.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs">
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone, or colour..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-stone-900"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Colour Variant Filter */}
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none"
          >
            <option value="All">All Colours</option>
            <option value="Blue">Blue Edition</option>
            <option value="White">White Edition</option>
            <option value="Orange">Orange Edition</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-xs space-y-2">
            <p className="font-semibold text-stone-600">No customer orders found matching filter.</p>
            <p>Visit the public store and place a test order to see live real-time booking!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Order Ref & Date</th>
                  <th className="px-5 py-3.5">Customer & Phone</th>
                  <th className="px-5 py-3.5">Delivery Address</th>
                  <th className="px-5 py-3.5">Colour Variant & Qty</th>
                  <th className="px-5 py-3.5">Payment Method</th>
                  <th className="px-5 py-3.5">Total (NPR)</th>
                  <th className="px-5 py-3.5">Order Status</th>
                  <th className="px-5 py-3.5 text-right">Concierge Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredOrders.map((ord) => {
                  const whatsappPhone = getCleanNepalPhone(ord.customer.phone);
                  const selectedColor = ord.selectedColor || ord.items[0]?.color || 'Blue';
                  const hexColor =
                    selectedColor === 'Blue'
                      ? '#0284c7'
                      : selectedColor === 'White'
                      ? '#e2e8f0'
                      : selectedColor === 'Orange'
                      ? '#ea580c'
                      : '#a8a29e';

                  return (
                    <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Ref & Date */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-stone-900 block">
                          {ord.id}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-stone-900">{ord.customer.fullName}</p>
                        <p className="text-[11px] text-stone-600 font-mono">{ord.customer.phone}</p>
                        {ord.customer.altPhone && (
                          <p className="text-[10px] text-stone-400 font-mono">Alt: {ord.customer.altPhone}</p>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-5 py-3.5 max-w-xs text-stone-600">
                        <p className="font-medium text-stone-900">
                          {ord.customer.houseNumber}, {ord.customer.areaTole}
                        </p>
                        <p className="text-[11px]">{ord.customer.fullAddress}</p>
                        <p className="text-[10px] text-stone-400">
                          {ord.customer.cityMunicipality}, {ord.customer.district} ({ord.customer.province})
                        </p>
                        {ord.customer.landmark && (
                          <p className="text-[10px] text-amber-800">Near: {ord.customer.landmark}</p>
                        )}
                      </td>

                      {/* Colour Variant & Items */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-950 border border-stone-200">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: hexColor }}
                            />
                            <span>{selectedColor} Edition</span>
                          </span>
                          <div className="text-[11px] text-stone-500 mt-1">
                            {ord.items.map((it, idx) => (
                              <span key={idx}>
                                {it.quantity}x {it.productName}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-stone-900 block">{ord.paymentMethod}</span>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              ord.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {ord.paymentStatus || (ord.paymentMethod === 'eSewa' ? 'PAID' : 'UNPAID')}
                          </span>
                          {ord.esewaNumber && (
                            <span className="block text-[10px] text-stone-400 font-mono">
                              eSewa: {ord.esewaNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-3.5 font-bold text-stone-950 tabular-nums">
                        {formatNPR(ord.totalAmount)}
                        <span className="block text-[10px] font-normal text-emerald-700">
                          Free Nepal Delivery
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-5 py-3.5">
                        <select
                          value={ord.status}
                          disabled={updatingId === ord.id}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold focus:outline-none cursor-pointer border ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : ord.status === 'Pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : ord.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-stone-100 text-stone-800 border-stone-200'
                          }`}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Concierge Contact */}
                      <td className="px-5 py-3.5 text-right space-x-2 shrink-0">
                        <a
                          href={`tel:${ord.customer.phone}`}
                          title="Call Customer directly"
                          className="inline-flex p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                            `Namaste ${ord.customer.fullName}, this is CLEVARA concierge regarding your order ${ord.id} for the ${selectedColor} Window Cleaner. We are preparing free delivery to ${ord.customer.areaTole}, ${ord.customer.cityMunicipality}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat on WhatsApp"
                          className="inline-flex p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
