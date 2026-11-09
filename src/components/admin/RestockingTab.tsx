import React, { useState, useEffect } from 'react';
import { Product, RestockSubscription } from '../../types';
import { api } from '../../services/api';
import { Bell, Calendar, Package, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface RestockingTabProps {
  products: Product[];
  onRefresh: () => Promise<void>;
}

export const RestockingTab: React.FC<RestockingTabProps> = ({ products, onRefresh }) => {
  const [subscribers, setSubscribers] = useState<RestockSubscription[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockStatus, setRestockStatus] = useState<string>('restocking_soon');
  const [expectedDate, setExpectedDate] = useState<string>('');
  const [incomingStock, setIncomingStock] = useState<number | string>(50);
  const [announcement, setAnnouncement] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      const data = await api.adminGetRestockSubscribers();
      setSubscribers(data);
    } catch (e) {
      console.warn('Failed to fetch subscribers', e);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleOpenEdit = (p: Product) => {
    setSelectedProduct(p);
    setRestockStatus(p.restockStatus || 'restocking_soon');
    setExpectedDate(p.expectedRestockDate || '');
    setIncomingStock(p.incomingStock ?? 50);
    setAnnouncement(p.restockAnnouncement || '');
  };

  const handleSaveRestockInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsUpdating(true);
    try {
      await api.adminUpdateProduct(selectedProduct.id, {
        restockStatus,
        expectedRestockDate: expectedDate || undefined,
        incomingStock: incomingStock ? Number(incomingStock) : undefined,
        restockAnnouncement: announcement.trim() || undefined,
      });
      await onRefresh();
      setSelectedProduct(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update restock info');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotifySubscribers = async (productId: string) => {
    setNotifyingId(productId);
    try {
      const res = await api.adminNotifyRestock(productId);
      alert(`Restock alert broadcasted to ${res.count} subscribed clients!`);
      await fetchSubscribers();
    } catch (err: any) {
      alert(err.message || 'Failed to trigger notifications');
    } finally {
      setNotifyingId(null);
    }
  };

  const outOrRestockingProducts = products.filter(
    (p) => p.stock === 0 || p.restockStatus !== 'available'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Restocking & Pre-Release Pipeline
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Configure expected arrival dates, incoming batch quantities, and alert subscribed clients upon arrival.
          </p>
        </div>
      </div>

      {/* Products under Restock Attention */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 bg-stone-50/50 flex justify-between items-center">
          <h3 className="text-sm font-serif font-bold text-stone-900">
            Formulas Requiring Restock or Announcement
          </h3>
          <span className="text-xs text-stone-500">
            {outOrRestockingProducts.length} items flagged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Formula & SKU</th>
                <th className="px-5 py-3.5">Current Stock</th>
                <th className="px-5 py-3.5">Restock Status</th>
                <th className="px-5 py-3.5">Expected Restock Date</th>
                <th className="px-5 py-3.5">Incoming Batch</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {products.map((p) => {
                const subCount = subscribers.filter((s) => s.productId === p.id && !s.notified).length;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/80">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-900">{p.name}</p>
                      <p className="text-[11px] font-mono text-stone-400">{p.sku}</p>
                    </td>

                    <td className="px-5 py-3.5 font-bold tabular-nums">
                      <span className={p.stock === 0 ? 'text-rose-700' : 'text-stone-900'}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                          p.restockStatus === 'coming_soon'
                            ? 'bg-purple-50 text-purple-800'
                            : p.restockStatus === 'restocking_soon'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {p.restockStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-stone-600">
                      {p.expectedRestockDate ? (
                        <span className="font-mono">{p.expectedRestockDate}</span>
                      ) : (
                        <span className="text-stone-400 italic">Not specified</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 tabular-nums">
                      {p.incomingStock ? `${p.incomingStock} units` : '—'}
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Configure
                      </button>
                      {subCount > 0 && (
                        <button
                          onClick={() => handleNotifySubscribers(p.id)}
                          disabled={notifyingId === p.id}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Alert ({subCount})</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscribed Customers Registry */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 bg-stone-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-serif font-bold text-stone-900">
              Customer Restock Waitlist Requests
            </h3>
          </div>
          <span className="text-xs text-stone-500">{subscribers.length} requests logged</span>
        </div>

        {subscribers.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            No restock notification requests logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-60">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold sticky top-0">
                <tr>
                  <th className="px-5 py-3">Formula Requested</th>
                  <th className="px-5 py-3">Client Contact</th>
                  <th className="px-5 py-3">Request Date</th>
                  <th className="px-5 py-3">Notification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/60">
                    <td className="px-5 py-2.5 font-semibold text-stone-900">{s.productName}</td>
                    <td className="px-5 py-2.5 font-mono text-stone-700">{s.contact}</td>
                    <td className="px-5 py-2.5 text-stone-400 font-mono text-[11px]">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          s.notified ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {s.notified ? 'Notified' : 'Pending Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Restock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fade-in text-xs">
            <h3 className="text-base font-serif font-bold text-stone-900">
              Restock Settings — {selectedProduct.name}
            </h3>

            <form onSubmit={handleSaveRestockInfo} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Restock Status</label>
                <select
                  value={restockStatus}
                  onChange={(e) => setRestockStatus(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none"
                >
                  <option value="available">Available (Normal Stock)</option>
                  <option value="restocking_soon">Restocking Soon</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Expected Restocking Date</label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-stone-400">
                  Will only be displayed to customers if explicitly provided.
                </p>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Incoming Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={incomingStock}
                  onChange={(e) => setIncomingStock(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Announcement Note for Customers</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Next production batch arriving in Kathmandu on Nov 25."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-md font-semibold"
                >
                  {isUpdating ? 'Saving...' : 'Update Restock Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
