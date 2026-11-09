import React, { useState } from 'react';
import { LimitedOffer, Product } from '../../types';
import { api } from '../../services/api';
import { formatNPR } from '../../utils/pricing';
import { Zap, Plus, Trash2, Clock, Check, X } from 'lucide-react';

interface LimitedOffersTabProps {
  offers: LimitedOffer[];
  products: Product[];
  onRefresh: () => Promise<void>;
}

export const LimitedOffersTab: React.FC<LimitedOffersTabProps> = ({ offers, products, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [specialPrice, setSpecialPrice] = useState<number | string>(1250);
  const [totalOfferStock, setTotalOfferStock] = useState<number | string>(20);
  const [maxPerCustomer, setMaxPerCustomer] = useState<number | string>(2);
  const [endTime, setEndTime] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !productId) return;

    setIsSubmitting(true);
    try {
      await api.adminCreateLimitedOffer({
        title: title.trim(),
        productId,
        specialPrice: Number(specialPrice),
        totalOfferStock: Number(totalOfferStock),
        maxPerCustomer: Number(maxPerCustomer),
        endTime: new Date(endTime).toISOString(),
      });
      await onRefresh();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this flash sale offer?')) {
      try {
        await api.adminDeleteLimitedOffer(id);
        await onRefresh();
      } catch (err: any) {
        alert(err.message || 'Failed to delete offer');
      }
    }
  };

  const handleToggleActive = async (offer: LimitedOffer) => {
    try {
      await api.adminUpdateLimitedOffer(offer.id, { isActive: !offer.isActive });
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update offer');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Limited-Time Offers & Flash Sales
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Configure genuine countdown promotions, limited purchase quotas, and server-validated flash markdowns.
          </p>
        </div>

        <button
          onClick={() => {
            setTitle('Flagship Launch Privilege — Spray Window Cleaner');
            setProductId(products[0]?.id || '');
            setSpecialPrice(1250);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Flash Sale</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const product = products.find((p) => p.id === offer.productId);
          const isExpired = new Date(offer.endTime) < new Date();

          return (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      offer.isActive && !isExpired
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {isExpired ? 'Ended' : offer.isActive ? 'Active Flash Sale' : 'Paused'}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Max {offer.maxPerCustomer} / client
                  </span>
                </div>

                <h3 className="text-base font-serif font-bold text-stone-900">
                  {offer.title}
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  {product?.name || 'Selected Formula'}
                </p>

                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-stone-950 tabular-nums">
                    {formatNPR(offer.specialPrice)}
                  </span>
                  <span className="text-xs text-stone-400 line-through tabular-nums">
                    {formatNPR(offer.originalPrice)}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 font-light">
                  {offer.soldStock} of {offer.totalOfferStock} units claimed
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-light flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>Ends {new Date(offer.endTime).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(offer)}
                    className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded"
                    title={offer.isActive ? 'Pause Sale' : 'Activate Sale'}
                  >
                    {offer.isActive ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fade-in text-xs">
            <h3 className="text-base font-serif font-bold text-stone-900">
              Create Flash Sale Offer
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flagship Launch Privilege — Window Cleaner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Target Product *</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Regular {formatNPR(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Special Price in NPR *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={specialPrice}
                    onChange={(e) => setSpecialPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Max Units / Client</label>
                  <input
                    type="number"
                    min="1"
                    value={maxPerCustomer}
                    onChange={(e) => setMaxPerCustomer(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Flash End Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-md font-semibold"
                >
                  {isSubmitting ? 'Activating...' : 'Publish Flash Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
